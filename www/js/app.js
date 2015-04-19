angular.module('akala', ['ionic', 'akala.services', 'akala.filters', 'akala.controllers']).run(function ($ionicPlatform) {
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
}).run(function ($rootScope, $http, UserSrv) {
    UserSrv.logonWithLocalUser();
}).config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.tabs.style('standard');

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
                    templateUrl: 'templates/tab-shop.html',
                    controller: 'ShopCtrl'
                }
            }
        })

        .state('tab.mine', {
            url: '/mine',
            views: {
                'tab-mine': {
                    templateUrl: 'templates/tab-mine.html'
                }
            }
        })

        .state('tab.mine.summary', {
            url: "/summary",
            templateUrl: 'templates/mine-summary.html',
            controller: 'MineSummaryCtrl'
        })

        .state('tab.mine.login', {
            url: "/login",
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/shop');

});