/**
 * Created by arjunMitraReddy on 7/20/2016.
 */
(function() {
    'use strict';

    angular.module('restrevirew')
        .controller('reviewDirectiveController', reviewDirectiveController);

    reviewDirectiveController.$inject = ['$scope'];

    function reviewDirectiveController($scope) {
        $scope.rate = null;
        $scope.main = null;
        $scope.point = null;
        $scope.ratings = [];
        $scope.rate = $scope.review.rating.toString();
        $scope.main = parseInt($scope.rate[0]);
        $scope.point = null;
        for (var i = 1; i <= 5; i++) {
            if (i <= $scope.main) {
                $scope.ratings.push({i: i});
            }
            else if (i == $scope.main + 1 && $scope.point > 0) {
                $scope.ratings.push({i: -1});
            }
            else {
                $scope.ratings.push({i: 0});
            }
        }
    }


})();