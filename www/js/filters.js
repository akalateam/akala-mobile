/**
 * Created by Shane on 2015/4/19.
 */
angular.module('akala.filters', [])
    .filter('translate', function () {
        return function (input) {
            if (input === 'Phone') {
                return '电话';
            } else if (input === 'Email') {
                return '邮箱';
            }
        }
    });