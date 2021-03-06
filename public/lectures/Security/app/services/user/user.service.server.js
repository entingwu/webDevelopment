var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose      = require("mongoose");

module.exports = function(app) {

    var userModel = require("../../models/user/user.model.server.js")();
    var UserModel = userModel.getMongooseModel();

    var auth = authorized;
    /* express object app listen to the api login
    * passport takes a look at the request, successful let it go*/
    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post  ('/api/logout',         logout);//no middleware
    app.post  ('/api/register',       register);//no protect
    app.post  ('/api/user',     auth, createUser);

    app.get   ('/api/loggedin',       loggedin);
    app.get   ('/api/user',     auth, findAllUsers);//first check: auth, second check: isAdmin()
    app.put   ('/api/user/:id', auth, updateUser);//update
    app.delete('/api/user/:id', auth, deleteUser);

    //1. new LocalStrategy(function)
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);//to client
    passport.deserializeUser(deserializeUser);//back from client

    //1. If is username&&password, done
    function localStrategy(username, password, done) {//call done from passport
        userModel//mongoose
            .findUserByCredentials({username: username, password: password})
            .then(
                function(user) {
                    if (!user) { return done(null, false); }//null, not exist
                    return done(null, user);//send to passport.js user
                },
                function(err) {
                    if (err) { return done(err); }
                }
            );
    }

    /* handle the incoming login */
    function login(req, res) {
        var user = req.user;//retrieve the already login user and send back to client
        res.json(user);
        //get the cookie back, find at least id, available on browser, unsafe
    }
    /* send to client */
    function serializeUser(user, done) {
        done(null, user);//user at least have id in cookie
    }

    /* request comes back */
    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)//find the user
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {//nav.controller
        req.logOut();//request function
        res.send(200);
    }

    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ['admin'];

        userModel
            .findUserByUsername(newUser.username)//check if the user already exist
            .then(
                function(user){
                    if(user) {
                        res.json(null);//exist
                    } else {
                        return userModel.createUser(newUser);//brand new user
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){//return new user from createUser
                    if(user){
                        req.login(user, function(err) {//notify passport, serialize
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    function findAllUsers(req, res) {
        if(isAdmin(req.user)) {
            userModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function () {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    /* First check : auth
    * app.get   ('/api/user',     auth, findAllUsers)*/
    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();//callback, continue in the chain
        }
    }

    function isAdmin(user) {
        if(user.roles.indexOf("admin") > 0) {
            return true
        }
        return false;
    }

    function createUser(req, res) {
        var newUser = req.body;
        if(newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["student"];
        }

        // first check if a user already exists with the username
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        // create a new user
                        return userModel.createUser(newUser)
                            .then(
                                // fetch all the users
                                function(){
                                    return userModel.findAllUsers();
                                },
                                function(err){
                                    res.status(400).send(err);
                                }
                            );
                        // if the user already exists, then just fetch all the users
                    } else {
                        return userModel.findAllUsers();
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(){
                    res.status(400).send(err);
                }
            )
    }

    /* app.delete('/api/user/:id', auth, deleteUser); */
    function deleteUser(req, res) {
        if(isAdmin(req.user)) {

            userModel
                .removeUser(req.params.id)
                .then(
                    function(user){//return from removeUser
                        return userModel.findAllUsers();
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                )
                .then(
                    function(users){//return from findAllUsers
                        console.log("deleted users" + users);
                        res.json(users);
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function updateUser(req, res) {
        var newUser = req.body;
        if(!isAdmin(req.user)) {
            delete newUser.roles;//If it is not admin, remove all roles
        }
        if(typeof newUser.roles == "string") {
            newUser.roles = newUser.roles.split(",");//spilt and send back string
        }

        userModel
            .updateUser(req.params.id, newUser)
            .then(
                function(user){
                    return userModel.findAllUsers();
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

};