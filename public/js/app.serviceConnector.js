/**
 * Created by arjunMitraReddy on 7/17/2016.
 */
(function () {
    'use strict';

    angular.module('restrevirew')
        .factory('serviceConnectorFactory', serviceConnectorFactory);
    /* @ngInject */
    serviceConnectorFactory.$inject = [
        '$http',
        '$q'
    ];
    /* @ngInject */
    function serviceConnectorFactory($http, $q) {
        return {
            get: getHandler,
            post: postHandler
        };
        function getHandler(url, config) {
            return $http.get(url, config)
                .then(function (response) {
                    return response.data;
                });
        }
        function postHandler(url, payload) {
            return $http.post(url, payload)
                .then(function (response) {
                    return response.data;
                });
        }
    }

})();