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

    .directive('akalaPhone', function () {
        return {
            restrict : 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, controller) {
                scope.$watch(attrs.ngModel, function () {
                    if(validator.isMobilePhone(element.val(), 'zh-CN')) {
                        controller.$setValidity('phone', true);
                    } else {
                        controller.$setValidity('phone', false);
                    }
                });
            }
        };
    })
;