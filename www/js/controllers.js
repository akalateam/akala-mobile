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
    });
