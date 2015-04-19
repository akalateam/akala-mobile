/**
 * Created by Shane on 2015/4/19.
 */
angular.module('akala.directives', [])
    .directive('userKey', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$validators.userKey = function (modelValue, viewValue) {
                    if (validator.isMobilePhone(viewValue, 'zh-CN') || validator.isEmail(viewValue)) {
                        return true;
                    }
                    return false;
                };
            }
        };
    });