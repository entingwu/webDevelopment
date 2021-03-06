(function(){
    "use strict";
    angular
        .module("FormBuilderApp")
        .controller("ProfileController",ProfileController);

    function ProfileController($scope, $location, $rootScope, UserService) {
        var model = this;
        model.$location = $location;
        model.update = update;

        function update(profileUser) {
            var emails = profileUser.emails.toString();
            profileUser.emails = emails.split(",");
            var phones = profileUser.phone.toString();
            profileUser.phone = phones.split(",");
            console.log(profileUser.phone);
            UserService
                .updateUserById($rootScope.user._id, profileUser)
                .then(
                    function(user) {
                        $rootScope.user = user.data;
                        console.log("update profile user: ", $rootScope.user);
                        $location.url("/profile");
                        $scope.alert = "Updated successfully";
                    },
                    function(err) {
                        $scope.error = err;
                    }
                );
        }

        model.user = $rootScope.user;
        if(!model.user) {
            $location.url("/home");
        }
    }
})();