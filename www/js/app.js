angular.module('akala', ['ionic', 'akala.services', 'akala.directives', 'akala.filters', 'akala.controllers']).run(function ($ionicPlatform) {
    $ionicPlatform.ready().then(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
}).run(function ($rootScope, $http, $window, UserSrv, Router2Console) {
    UserSrv.logonWithLocalUser();
    Router2Console.active = $window.akala.enableDebug;
}).constant('$ionicLoadingConfig', {
    template: '<ion-spinner class="spinner-balanced"></ion-spinner>'
}).config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');
    //$ionicConfigProvider.views.maxCache(0);

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })

        // Each tab has its own nav history stack:

        .state('tab.shop', {
            url: '/shop',
            views: {
                'tab-shop': {
                    templateUrl: 'templates/shop/tab-shop.html',
                    controller: 'ShopCtrl'
                }
            }
        })

        .state('tab.mine', {
            url: '/mine',
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/tab-mine.html',
                    controller: 'MineCtrl'
                }
            }
        })

        .state('tab.login', {
            url: "/login",
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/login.html',
                    controller: 'LoginCtrl'
                }
            }
        })

        .state('tab.resetpwd', {
            url: "/resetpwd",
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/resetpwd.html',
                    controller: 'ResetpwdCtrl'
                }
            }
        })

        .state('tab.signup', {
            url: '/signup',
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/signup.html',
                    controller: 'SignupCtrl'
                }
            }
        })

        .state('tab.address', {
            url: '/address',
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/address.html',
                    controller: 'AddressDetailCtrl'
                }
            }
        })

        .state('tab.address-detail', {
            url: '/address-detail/:pageType',
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/address-detail.html',
                    controller: 'AddressNewAmendCtrl'
                }
            }
        })

        .state('tab.address-map', {
            url: '/address-map',
            views: {
                'tab-mine': {
                    templateUrl: 'templates/mine/address-map.html',
                    controller: 'AddressMapCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/shop');

});