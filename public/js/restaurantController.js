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
        rstCtrl.fetchingRest = false;
        rstCtrl.searchQuery = null;
        rstCtrl.restaurants = [];
        rstCtrl.getRestuarants = function () {
            rstCtrl.fetchingRest = true;
            $rootScope.hasResults = true;
            rstCtrl.restaurants = [];
            serviceConnectorFactory.post('/getRest', {query : rstCtrl.searchQuery})
                .then(function (data) {
                    var defer = $q.defer();
                    _.forEach(data.restaurants, function(obj) {
                        rstCtrl.restaurants.push(obj.restaurant);
                        rstCtrl.backup = angular.copy(rstCtrl.restaurants);
                    });
                    defer.resolve();
                    return defer.promise;
                })
                .then(function () {
                    rstCtrl.fetchingRest = false;
                    $('html, body').animate({ scrollTop: $('.top-container').height() }, 1000);
                    $timeout(function() {
                        if (rstCtrl.restaurants.length > 0) {
                            $('#yesResults').focus();
                        }
                        else {
                            $('#noResults').focus();
                        }
                    }, 0);
                })
        };
        rstCtrl.typeFilter = null;

        rstCtrl.filterSet = false;
        rstCtrl.sortBy = function(filter) {
            if (filter == 'rating') {
                  rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.user_rating.aggregate_rating; });
            }
            else if (filter == 'ratingH') {
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.user_rating.aggregate_rating; }).reverse();
            }
            else if (filter == 'price') {
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.average_cost_for_two })
            }
            else if (filter == 'priceH') {
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.average_cost_for_two }).reverse();
            }
            else if (filter == 'cuisine') {
                rstCtrl.filterSet = true;
                rstCtrl.restaurants = _.sortBy(rstCtrl.restaurants, function(rest) { return rest.cuisines; });
            }
        };
        rstCtrl.clearFilter = function() {
            rstCtrl.filterSet = false;
            rstCtrl.typeFilter = '';
            rstCtrl.restaurants = angular.copy(rstCtrl.backup);
        };
        rstCtrl.setFocusToFilterMenu = function() {
            $timeout(function() {
                $('#filters_menu').focus();
                $location.path('/welcome');
            }, 0);
        };
    }
})();