/**
 * Created by arjunMitraReddy on 7/17/2016.
 */
(function() {
    'use strict';

    angular.module('restrevirew')
        .directive('resultDirective', resultDirective);

    function resultDirective() {
        return {
            restrict: 'E',
            scope: {
                restaurant: '='
            },
            controller: 'resultDirectiveController',
            templateUrl: '/templates/result.html'
        }
    }

})();