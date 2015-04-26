/**
 * Created by Shane on 2015/4/14.
 */
angular.module('akala.controllers', [])
    .controller('ShopCtrl', function ($scope) {
    })

    .controller('MineSummaryCtrl', function ($scope, $rootScope, UserSrv) {
        $scope.logout = function () {
            UserSrv.removeLocalUser();
            delete $rootScope.localUserInfo;
        }
    })

    .controller('LoginCtrl', function ($scope, $state, $ionicLoading, UserSrv) {
        $scope.signIn = function (user) {

            if (!user || !user.userKey || !user.password) {
                return;
            }

            var userInfo = {};
            userInfo.userKey = user.userKey;
            userInfo.userType = UserSrv.getUserType(user.userKey);
            userInfo.password = user.password;

            $ionicLoading.show();
            UserSrv.setLocalUser(userInfo).then(UserSrv.logonWithLocalUser).then(function (user) {
                $state.go('tab.mine.summary');
                $ionicLoading.hide();
            }).catch(function (error) {
                $scope.$apply(function (error) {
                    $scope.loginError = error;
                }(error));
                $ionicLoading.hide();
            });
        }
    })

    .controller('SignupCtrl', function($scope, $state, $ionicLoading, $interval, UserSrv, MobileSrv) {
        $scope.leftSeconds = "";

        $scope.signupUser = function () {
            var userKey = '';
            if ($scope.signupType != 'Email') {
                userKey = $scope.user.mobile;
                $scope.signupType = 'Phone';
            } else if ($scope.signupType == 'Email') {
                userKey = $scope.user.email;
            }
            var userInfo = {};
            userInfo.userKey = userKey;
            userInfo.userType = $scope.signupType;
            userInfo.password = $scope.user.password;
            userInfo.mobileCredentials = $scope.user.mobileCredentials;

            $ionicLoading.show();
            UserSrv.setLocalUser(userInfo).then(UserSrv.signupUser).then(function (user) {
                $state.go('tab.mine.summary');
                $ionicLoading.hide();
            }).catch(function (error) {
                $scope.$apply(function (error) {
                    $scope.signupError = error;
                }(error));
                $ionicLoading.hide();
            });
        };

        $scope.sendMobileCredentials = function (button) {
            if (validator.isMobilePhone($scope.user.mobile, 'zh-CN')) {
                MobileSrv.sendMobileCredentials($scope.user.mobile).then(function(credentials) {
                    $scope.user.mobileCredentials = credentials;

                    $scope.leftSeconds = 60;
                    var signUpTimeoutFunc = function() {
                        if ($scope.leftSeconds === 0) {
                            $interval.cancel(signUpTimeout);
                            $scope.leftSeconds = '';
                            return;
                        }
                        $scope.leftSeconds--;
                    };
                    var signUpTimeout = $interval(signUpTimeoutFunc, 1000);
                })
            }
        };

        $scope.changeSignupType = function(type) {
            $scope.signupType = type;
            $scope.user.password = '';
            $scope.signupError = '';
        };
    });
