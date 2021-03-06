(function() {
    "use strict";
    angular
        .module("FormBuilderApp")
        .factory("UserService", userService);

    function userService($http, $q, $rootScope) {//angular q
        var service = {
            findUserByUsername : findUserByUsername,
            findUserById : findUserById,
            findUserByCredentials : findUserByCredentials,
            findAllUsers : findAllUsers,
            createUser : createUser,
            deleteUserById : deleteUserById,
            updateUser : updateUser,
            setUser : setUser,
            getUser : getUser
        };
        return service;

        //CRUD : return the request
        function createUser(user) {
            var deferred = $q.defer();
            $http
                .post('/api/assignment/user', user)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function deleteUserById(userId) {
            var deferred = $q.defer();
            $http
                .delete('/api/assignment/user/' + userId)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }
        //PROFILE
        function updateUser(userId, user) {
            var deferred = $q.defer();
            $http
                .put('/api/assignment/user/' + userId, user)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        //FIND : go to server to find, return the promise
        function findUserByUsername(username) {
            var deferred = $q.defer();
            $http
                .get('/api/assignment/user?username=' + username)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserById(userId) {
            var deferred = $q.defer();
            $http
                .get('/api/assignment/user/' + userId)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findUserByCredentials(username, password) {
            var deferred = $q.defer();
            $http
                .get('/api/assignment/user?username=' + username + '&' +'password=' + password)
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function findAllUsers() {
            var deferred = $q.defer();
            $http
                .get('/api/assignment/user')
                .success(function(response) {
                    deferred.resolve(response);
                });
            return deferred.promise;
        }

        function setUser(user) {
            $rootScope.user = user;
        }
        function getUser() {
            return $rootScope.user;
        }
    }
})();
