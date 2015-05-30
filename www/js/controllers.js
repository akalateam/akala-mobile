/**
 * Created by Shane on 2015/4/14.
 */
angular.module('akala.controllers', [])
    .controller('ShopCtrl', function ($scope) {
    })

    .controller('MineCtrl', function ($scope, $rootScope, $state, UserSrv) {
        $scope.logout = function () {
            UserSrv.removeLocalUser();
            delete $rootScope.localUserInfo;
        };
        $scope.goToAddress = function () {
            if ($rootScope.localUserInfo) {
                $state.go('tab.address');
            } else {
                $state.go('tab.login');
            }
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
                $state.go('tab.mine');
                $ionicLoading.hide();
            }).catch(function (error) {
                $scope.$apply(function (error) {
                    $scope.loginError = error;
                }(error));
                $ionicLoading.hide();
            });
        }
    })

    .controller('SignupCtrl', function ($scope, $state, $ionicLoading, $interval, UserSrv, MobileSrv) {
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
                $state.go('tab.mine');
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
                MobileSrv.sendMobileCredentials($scope.user.mobile).then(function (credentials) {
                    $scope.user.mobileCredentials = credentials;

                    $scope.leftSeconds = 60;
                    var signUpTimeoutFunc = function () {
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

        $scope.changeSignupType = function (type) {
            $scope.signupType = type;
            $scope.signupError = '';
            if ($scope.user) {
                $scope.user.password = '';
            }
        };
    })

    .controller('ResetpwdCtrl', function ($scope, $ionicLoading, UserSrv) {
        $scope.resetpwd = function (userKey) {
            if (!userKey) {
                return;
            }

            $scope.resetpwdInfo = '';
            $scope.resetpwdError = '';

            $ionicLoading.show();
            UserSrv.resetpwd(userKey).then(function (data) {
                $scope.resetpwdInfo = data;
                $ionicLoading.hide();
            }).catch(function (error) {
                $scope.resetpwdError = error;
                $ionicLoading.hide();
            });
        }
    })

    .controller('AddressDetailCtrl', function ($scope, $stateParams) {

    })

    .controller('AddressNewAmendCtrl', function ($scope, $stateParams, $ionicModal, AddressSrv) {
        if ($stateParams.pageType == 'N') {
            $scope.title = '新增地址';
            AddressSrv.initNewAddress();
            $scope.addrInfo = AddressSrv.currentAddress;
        } else if ($stateParams.pageType == 'A') {
            $scope.title = '修改地址';
        }

        $scope.saveAddress = function () {
            var validateResult = AddressSrv.validateAddress();
            if (validateResult !== true) {
                $scope.alertHtml = validateResult;
                $ionicModal.fromTemplateUrl('templates/alert-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.alertModal = modal;
                    $scope.alertModal.show();
                });
            } else {
                AddressSrv.saveAddress()
            }
        }
    })

    .controller('AddressMapCtrl', function ($scope, $stateParams, $timeout, $state, AddressSrv) {
        var longitude, latitude;
        if (AddressSrv.currentAddress.location) {
            longitude = AddressSrv.currentAddress.location.lng;
            latitude = AddressSrv.currentAddress.location.lat;
        }

        //init Map Obj
        $scope.mapObj = new AMap.Map("mapContainer", {
            resizeEnable: true,
            view: new AMap.View2D({
                resizeEnable: true,
                center: new AMap.LngLat(longitude || 0, latitude || 0),//地图中心点
                zoom: 13//地图显示的缩放级别
            }),
            keyboardEnable: false
        });

        //init Tool Bar
        $scope.mapObj.plugin(["AMap.ToolBar"], function () {
            $scope.toolBar = new AMap.ToolBar({
                ruler: false,
                direction: false,
                autoPosition: !(longitude && latitude)
            });
            $scope.mapObj.addControl($scope.toolBar);
            $scope.toolBar.hide();
        });

        // Get Selected Location
        AMap.event.addListener($scope.mapObj, "complete", function () {
            if (longitude && latitude) {
                $scope.updateMarker(new AMap.LngLat(longitude, latitude));
                $scope.updateNearby(new AMap.LngLat(longitude, latitude));
            }
        });

        // Get Current Location
        AMap.event.addListener($scope.toolBar, 'location', function (e) {
            $scope.updateMarker(e.lnglat);
            $scope.updateNearby(e.lnglat);
        });

        // Mouse Pickup
        AMap.event.addListener($scope.mapObj, 'click', function (e) {
            $scope.updateMarker(e.lnglat);
            $scope.updateNearby(e.lnglat);
        });

        $scope.updateMarker = function (lnglat) {
            if ($scope.marker) {
                $scope.marker.setPosition(lnglat);
            } else {
                $scope.addMarker(lnglat);
            }
        };

        $scope.addMarker = function (lngLat) {
            $scope.marker = new AMap.Marker({
                icon: "http://webapi.amap.com/images/marker_sprite.png",
                position: lngLat
            });
            $scope.marker.setMap($scope.mapObj);  //在地图上添加点
            $scope.mapObj.setFitView();
        };

        $scope.updateNearby = function (lnglat) {
            AMap.service(["AMap.Geocoder"], function () {
                var mGeocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });
                //逆地理编码
                mGeocoder.getAddress(lnglat, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        $scope.$apply($scope.nearbyPoints = result.regeocode.pois);
                    }
                });
            });
        };

        $scope.autoComplete = function (event) {
            $timeout(function () {
                var keywords = $scope.keywords;
                //加载输入提示插件
                AMap.service(["AMap.Autocomplete"], function () {
                    var autoOptions = {
                        city: "" //城市，默认全国
                    };
                    var auto = new AMap.Autocomplete(autoOptions);
                    //查询成功时返回查询结果
                    if (keywords && keywords.length > 0) {
                        auto.search(keywords, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                $scope.$apply($scope.searchResults = result.tips);
                            }
                        });
                    }
                });
            });
        };

        $scope.selectLocation = function (id) {
            AMap.service(["AMap.PlaceSearch"], function () {
                var search = new AMap.PlaceSearch();
                //逆地理编码
                search.getDetails(id, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        if (result.poiList && result.poiList.pois && result.poiList.pois.length) {
                            var addrInfo = result.poiList.pois[0];
                            AddressSrv.currentAddress.location.pguid = addrInfo.id;
                            AddressSrv.currentAddress.location.name = addrInfo.name;
                            AddressSrv.currentAddress.location.lng = addrInfo.location.lng;
                            AddressSrv.currentAddress.location.lat = addrInfo.location.lat;

                            $state.go('tab.address-detail', {pageType: 'N'});
                        }
                    }
                });
            });
        };
    });