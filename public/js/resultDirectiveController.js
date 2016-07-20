/**
 * Created by arjunMitraReddy on 7/17/2016.
 */
(function() {
    'use strict';

    angular.module('restrevirew')
        .controller('resultDirectiveController', resultDirectiveController);

    resultDirectiveController.$inject = ['$scope', '$uibModal', 'serviceConnectorFactory', '$timeout'];
    /* @ngInject */
    function resultDirectiveController($scope, $uibModal, serviceConnectorFactory, $timeout) {
        $scope.rate = $scope.restaurant.user_rating.aggregate_rating.split(".");
        $scope.main = parseInt($scope.rate[0]);
        $scope.point = parseInt($scope.rate[1]);
        $scope.ratings = [];
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
        $scope.reviews = [];
        $scope.getReviews = function () {
            $scope.reviews = [];
            serviceConnectorFactory.post('/getReviews', {restID: $scope.restaurant.R.res_id})
                .then(function (data) {
                    $scope.reviews = data.user_reviews;
                    $scope.openReviewsModal('lg');
                })
        };
        $scope.openReviewsModal = function(size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'reviews.html',
                controller: 'reviewModalController',
                size: size,
                resolve: {
                    reviews: function () {
                        return $scope.reviews;
                    }
                }
            });
        };
    }
})();