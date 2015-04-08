angular.module('starter', ['ionic']).controller('LoginCtrl', function ($scope, $http) {

    $scope.signIn = function (user) {
        var responsePromise = $http.get(akala.httpconf.url + 'ws/sec/test', {
            headers: {
                'Authorization': $scope.getAuthHead(user.name, user.password)
            }
        });
        responsePromise.success(function (data, status, headers, config) {
            user.status = '登陆成功';
        });
        responsePromise.error(function (data, status, headers, config) {
            user.status = '登录失败';
        });
    };

    $scope.getAuthHead = function (username, password) {
        var userNameAndType = '';
        if (validator.isMobilePhone(username, 'zh-CN')) {
            userNameAndType = username + '|' + 'Phone';
        } else if (validator.isEmail(username)) {
            userNameAndType = username + '|' + 'Email';
        }
        return 'Basic ' + btoa(userNameAndType + ':' + password);
    }
})
;
