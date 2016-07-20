/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
(function() {
    "use strict";
    angular.module('restrevirew')
        .config(config);

    config.$inject = ['$stateProvider', '$locationProvider'];
    /* @ngInject */
    function config($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $stateProvider
            .state('index', {
                url: '/welcome',
                controller: 'restaurantController',
                controllerAs: 'rstCtrl',
                templateUrl: '/templates/restaurant-search.html'
            });
    }
})();