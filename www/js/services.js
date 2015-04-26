/**
 * Created by Shane on 2015/4/18.
 */
angular.module('akala.services', [])
    .service('UserSrv', function ($http, $q, $rootScope, JsonToFormData) {
        var self = this;
        self.$http = $http;
        self.$q = $q;
        self.$rootScope = $rootScope;

        self.getLocalUser = function () {
            var deferred = self.$q.defer();
            localforage.getItem('user').then(function (value) {
                if (value && value.userKey && value.userType && value.password) {
                    deferred.resolve(value);
                } else {
                    deferred.reject('用户名或密码错误');
                }
            });
            return deferred.promise;
        };
        self.setLocalUser = function (userInfo) {
            return localforage.setItem('user', userInfo);
        };
        self.removeLocalUser = function () {
            localforage.removeItem('user');
        };
        self.logonWithLocalUser = function () {
            var deferred = self.$q.defer();
            self.getLocalUser().then(self.isUserValid).then(function (user) {
                self.$rootScope.localUserInfo = user;
                self.$rootScope.localUserInfo.valid = true;
                self.$http.defaults.headers.common.Authorization = self.getAuthHead(user.userKey, user.password);
                deferred.resolve(user);
            }).catch(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };
        self.isUserValid = function (userInfo) {
            var deferred = self.$q.defer();
            var authPromise = $http.get(akala.httpconf.url + 'ws/authUser', {
                    params: {
                        userKey: userInfo.userKey,
                        userType: userInfo.userType,
                        password: userInfo.password
                    }
                }
            );
            authPromise.success(function (data) {
                if (data === true) {
                    deferred.resolve(userInfo);
                } else {
                    deferred.reject('用户名或密码错误');
                }
            });
            authPromise.error(function (data) {
                deferred.reject('用户名或密码错误');
            });
            return deferred.promise;
        };
        self.getUserType = function (userKey) {
            if (validator.isMobilePhone(userKey, 'zh-CN')) {
                return 'Phone';
            } else if (validator.isEmail(userKey)) {
                return 'Email';
            }
        };
        self.getAuthHead = function (userKey, password) {
            var userType = self.getUserType(userKey);
            var userKeyAndType = userKey + '|' + userType;
            return 'Basic ' + btoa(userKeyAndType + ':' + password);
        };
        self.checkUserExist = function(userKey) {
            var userType = self.getUserType(userKey);
            var deferred = self.$q.defer();
            if (userType && userKey) {
                var authPromise = $http.get(akala.httpconf.url + 'ws/chekUserExist', {
                        params: {
                            userKey: userKey,
                            userType: userType
                        }
                    }
                );
                authPromise.success(function (data) {
                    deferred.resolve(data);
                });
                authPromise.error(function (data) {
                    deferred.reject("连接失败，请重试");
                });
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        };
        self.signupUser = function(userInfo) {
            var deferred = self.$q.defer();
            var authPromise = $http.post(akala.httpconf.url + 'ws/signupUser', {
                    userKey: userInfo.userKey,
                    userType: userInfo.userType,
                    password: userInfo.password,
                    credentials : userInfo.mobileCredentials
                }, {
                    transformRequest: JsonToFormData
                }
            );
            authPromise.success(function () {
                self.$rootScope.localUserInfo = userInfo;
                self.$rootScope.localUserInfo.valid = true;
                self.$http.defaults.headers.common.Authorization = self.getAuthHead(userInfo.userKey, userInfo.password);
                deferred.resolve(userInfo);
            });
            authPromise.error(function (data) {
                deferred.reject('用户已经被注册');
            });
            return deferred.promise;
        };
    })

    .service("MobileSrv",function($http, $q, JsonToFormData) {
        var self = this;
        self.$http = $http;
        self.$q = $q;

        self.sendMobileCredentials = function(mobile) {
            var deferred = self.$q.defer();
            var authPromise = $http.post(akala.httpconf.url + 'ws/credentials',
                {mobile: mobile}, {
                    transformRequest: JsonToFormData
                });
            authPromise.success(function(data){
                deferred.resolve(data);
            });
            authPromise.error(function (data) {
                deferred.reject();
            });
            return deferred.promise;
        };
    })

    .factory("JsonToFormData",function() {
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };
        function transformRequest( data, getHeaders ) {
            var headers = getHeaders();
            headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }
        return( transformRequest );
    });
;