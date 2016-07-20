/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
(function() {
    "use strict";
    angular.module('restrevirew')
        .controller('restaurantController', restaurantController);

    restaurantController.$inject = ['$q', 'serviceConnectorFactory', '$rootScope', '$timeout', '$location'];
    /* @ngInject */
    function restaurantController($q, serviceConnectorFactory, $rootScope, $timeout, $location) {
        var rstCtrl = this;
        rstCtrl.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
            'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
            'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
            'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota',
            'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
        rstCtrl.filters = ['Cuisine(A-Z)', 'Cuisine(Z-A)', 'Rating-Low', 'Rating-High', 'Location'];
        rstCtrl.fetchingRest = false;
        rstCtrl.searchQuery = null;
        rstCtrl.restaurants = [];
        rstCtrl.resultMessage = "Search Results";
        rstCtrl.getRestuarants = function () {
            rstCtrl.resultMessage = "Search Results";
            rstCtrl.fetchingRest = true;
            $rootScope.hasResults = true;
            rstCtrl.restaurants = [];
            serviceConnectorFactory.post('/getRest', {query : rstCtrl.searchQuery})
                .then(function (data) {
                    var defer = $q.defer();
                    var latLong;
                    serviceConnectorFactory.get("http://ipinfo.io").then(function(ipinfo){
                        latLong = ipinfo.loc.split(",");
                        var from = new google.maps.LatLng(parseFloat(latLong[0]), parseFloat(latLong[1]));
                        rstCtrl.from = from;
                        var to   = new google.maps.LatLng(49.321, 8.789);
                        var dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
                        console.log(dist);
                        _.forEach(data.businesses, function(obj) {
                            obj.distance = dist;
                            rstCtrl.restaurants.push(obj);
                        });
                        rstCtrl.backup = angular.copy(rstCtrl.restaurants);
                        defer.resolve();
                        return defer.promise;
                    });
                })
                .then(function () {
                    rstCtrl.fetchingRest = false;
                    $('html, body').animate({ scrollTop: $('.top-container').height() }, 1000);
                    rstCtrl.setFocusToResults();
                })
        };
        rstCtrl.setFocusToResults = function() {
            $timeout(function() {
                $('#yesResults').focus();
            });
        };
        rstCtrl.typeFilter = null;

        rstCtrl.filterSet = false;
        rstCtrl.sortBy = function(filter) {
            if (filter == '') {
                rstCtrl.filterSet = false;
            }
            if (filter == rstCtrl.filters[0]) {
                rstCtrl.resultMessage = "Search Results With Cuisines in Alphabetical Order";
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.categories[0][0]; });
            }
            if (filter == rstCtrl.filters[1]) {
                rstCtrl.resultMessage = "Search Results With Cuisines in Reverse Alphabetical Order";
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.categories[0][0]; }).reverse();
            }
            if (filter == rstCtrl.filters[2]) {
                rstCtrl.resultMessage = "Search Results with Ratings low to high";
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.rating; })
            }
            if (filter == rstCtrl.filters[3]) {
                rstCtrl.resultMessage = "Search Results with ratings high to low";
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.rating; }).reverse();
            }
            if (filter == rstCtrl.filters[4]) {
                rstCtrl.resultMessage = "Search Results with distance near to far";
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return Math.abs(rstCtrl.from - rest.distance); });
            }
        };
        rstCtrl.clearFilter = function() {
            rstCtrl.filterSet = false;
            rstCtrl.typeFilter = '';
            rstCtrl.restaurants = angular.copy(rstCtrl.backup);
            rstCtrl.resultMessage = "Search Results After Clearing Filter";
            $('html, body').animate({ scrollTop: $('.top-container').height() }, 1000);
            $timeout(function() {
                if (rstCtrl.restaurants.length > 0) {
                    $('#yesResults').focus();
                }
            }, 0);
        };
        rstCtrl.setFocusToFilterMenu = function() {
            $timeout(function() {
                $('#filters_menu').focus();
                $location.path('/welcome');
            }, 0);
        };
    }
})();