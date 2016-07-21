/**
 * Created by arjunMitraReddy on 7/17/2016.
 */
(function() {
    'use strict';

    angular.module('restrevirew')
        .directive('reviewDirective', reviewDirective);

    function reviewDirective() {
        return {
            restrict: 'E',
            scope: {
                review: '='
            },
            controller: 'reviewDirectiveController',
            templateUrl: '/templates/reviews.html'
        }
    }

})();