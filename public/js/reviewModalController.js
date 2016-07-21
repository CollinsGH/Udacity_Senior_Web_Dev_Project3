/**
 * Created by arjunMitraReddy on 7/17/2016.
 */
(function() {
    'use strict';

    angular.module('restrevirew')
        .controller('reviewModalController', reviewModalController);

    reviewModalController.$inject = ['$scope', '$uibModalInstance', 'reviews', '$location', '$timeout'];
    /* @ngInject */
    function reviewModalController($scope, $uibModalInstance, reviews, $location, $timeout) {
        $scope.reviews = reviews;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.commentName = null;
        $scope.comment = null;
        $scope.profilePic = null;
        $scope.userRating = null;
        $scope.gather = function() {
            var dateArr = new Date().toDateString().split(" ");
            var date = dateArr[1]+ " " + dateArr[2] + ", " + dateArr[3];
            $scope.review = {
                    user: {
                        name: $scope.commentName,
                        image_url: $scope.profilePic
                    },
                    rating: $scope.userRating,
                    excerpt: $scope.comment,
                    time_created: date
            };
            $scope.reviews.push($scope.review);
            $scope.commentName = null;
            $scope.comment = null;
            $timeout(() => {
                if ($scope.reviews.length > 0) {
                    $('#review-' + ($scope.reviews.length-1)).focus();
                }
                else {
                    $('#noReviews').focus();
                }
            }, 0);
        };
        $scope.setFocusToReview = function() {
            $('#namebox').focus();
            $location.path('/welcome');
        }
    }

})();
