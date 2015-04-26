/**
 * Created by Nick on 2015/4/17.
 */
angular.module('akala.directives', [])

    .directive('akalaUnique', ['UserSrv', function (UserSrv) {
        return {
            restrict : 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {
                scope.$watch(attrs.ngModel, function () {
                    UserSrv.checkUserExist(element.val()).then(function (unique) {
                        controller.$setValidity('unique', !unique);
                    }, function () {
                        controller.$setValidity('unique', true);
                    });
                });
            }
        };
    }])

    .directive('akalaMobile', function () {
        return {
            restrict : 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {
                scope.$watch(attrs.ngModel, function () {
                    if(validator.isMobilePhone(element.val(), 'zh-CN')) {
                        controller.$setValidity('mobile', true);
                    } else {
                        controller.$setValidity('mobile', false);
                    }
                });
            }
        };
    })

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
    })
;