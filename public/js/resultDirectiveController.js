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
        $scope.rate = $scope.restaurant.rating.toString().split(".");
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
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        $scope.reviews = [];
        $scope.getReviews = function () {
            $scope.reviews = [];
            serviceConnectorFactory.post('/getReviews', {restID: $scope.restaurant.id})
                .then(function (data) {
                    _.forEach(data.reviews, function (review) {
                        var date = new Date(review.time_created * 1000);
                        if (date.getDate() != null || date.getFullYear() != null) {
                            review.time_created = monthNames[date.getMonth()]+ " " + date.getDate() + ", " + date.getFullYear()
                        }

                    });
                    $scope.reviews = data.reviews;
                    $scope.openReviewsModal('lg');
                })
        };
        $scope.openReviewsModal = function(size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/templates/modalContent.html',
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