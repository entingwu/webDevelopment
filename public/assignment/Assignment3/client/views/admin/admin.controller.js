(function(){
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("AdminController",AdminController);

    function AdminController($scope, $rootScope, $location, UserService) {
        $scope.$location = $location;
    }
})();