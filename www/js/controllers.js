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

    .controller('LoginCtrl', function ($scope, $ionicHistory, UserSrv) {
        $scope.signIn = function (user) {

            if (!user || !user.userKey || !user.password) {
                return;
            }

            var userInfo = {};
            userInfo.userKey = user.userKey;
            userInfo.userType = UserSrv.getUserType(user.userKey);
            userInfo.password = user.password;

            UserSrv.setLocalUser(userInfo).then(UserSrv.logonWithLocalUser).then(function (user) {
                $ionicHistory.goBack();
            }).catch(function (error) {
                $scope.$apply(function (error) {
                    $scope.loginError = error;
                }(error));
            });
        }
    })

    .controller('SignupCtrl', function($scope, $ionicHistory, UserSrv) {
        var signupType = 'Phone';

        $scope.signupUser = function (user) {
            var userKey = '';
            if (signupType == 'Phone') {
                userKey = user.phone;
            } else if (signupType == 'Email') {
                userKey = user.email;
            }
            var userInfo = {};
            userInfo.userKey = userKey;
            userInfo.userType = signupType;
            userInfo.password = user.password;

            UserSrv.setLocalUser(userInfo).then(UserSrv.signupUser).then(function (user) {
                $ionicHistory.goBack();
            }).catch(function (error) {
                $scope.$apply(function (error) {
                    $scope.signupError = error;
                }(error));
            });
        };

        $scope.sendPhoneKey = function () {
            if (!validator.isMobilePhone(user.name, 'zh-CN')) {
                this.$error("手机号码格式不正确");
            } else {
                return registerService.getPhoneIndentificationCode();
            }
        };

        $scope.changeSignupType = function(signupType) {
            this.signupType = signupType;
            this.user.password = '';
        };
    });
