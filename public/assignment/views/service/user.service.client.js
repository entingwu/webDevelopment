/**
 * Created by entingwu on 2/19/16.
 */
(function(){
    angular
        .module("FormBuilderApp")
        .factory("UserService",UserService);

    function UserService() {
        var users = [
            {"_id":123, "firstName":"Alice",  "lastName":"Wonderland","username":"alice",  "password":"alice"},
            {"_id":234, "firstName":"Bob",    "lastName":"Hope",      "username":"bob",    "password":"bob"},
            {"_id":345, "firstName":"Charlie","lastName":"Brown",     "username":"charlie","password":"charlie"},
            {"_id":456, "firstName":"Dan",    "lastName":"Craig",     "username":"dan",    "password":"dan"},
            {"_id":567, "firstName":"Edward", "lastName":"Norton",    "username":"ed",     "password":"ed"}
        ];

        var service = {
            findUserByUsernameAndPassword : findUserByUsernameAndPassword,
            findAllUsers : findAllUsers,
            createUser : createUser,
            deleteUserById : deleteUserById,
            updateUser : updateUser
        };

        return service;

        function findUserByUsernameAndPassword(username, passoword, callback) {
            var user;
            for(var i = 0; i < users.length; i++) {
                if(users[i].username == username && users[i].password == passoword) {
                    user = users[i];
                }
            }
            callback(user);
        }

        function findAllUsers(callback) {
            callback(users);
        }

        function createUser(user, callback) {
            var newUser = {
                _id :(new Date).getTime(),
                username : user.username,
                password : user.password,
                email : user.email
            };
            users.push(newUser);
            callback(newUser);
        }

        function deleteUserById(userId, callback) {
            for(var i = 0; i < users.length; i++) {
                if(users[i]._id == userId) {
                    users.splice(i, 1);
                }
            }
            callback(users);
        }

        function updateUser(userId, user, callback) {
            var updateUser;
            for(var i = 0; i < users.length; i++) {
                if(users[i]._id == userId) {
                    users[i] = {
                        _id :(new Date).getTime(),
                        username : user.username,
                        password : user.password,
                        firsNname : user.firstName,
                        lastName : user.lastName,
                        email : user.email
                    }
                }
                updateUser = users[i];
            }
            callback(updateUser);
        }
    }
})();