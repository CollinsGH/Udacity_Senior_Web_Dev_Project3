/**
 * Created by arjunMitraReddy on 7/16/2016.
 */
(function() {
    "use strict";
    angular.module('restrevirew')
        .run(run);

    run.$inject = ['$state', '$rootScope'];
    /* @ngInject */
    function run($state, $rootScope) {
        $rootScope.hasResults = false;
        $state.go('index');
    }

})();