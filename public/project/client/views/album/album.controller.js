(function() {
    "use strict";
    angular
        .module("MusicPlayerApp")
        .filter('trustUrl', function ($sce) {
            return function(url) {
                return $sce.trustAsResourceUrl("https://embed.spotify.com/?uri=" + url);
            };
        })
        .filter('range', function() {
            return function(val, range) {
                range = parseInt(range / 20);
                for (var i=0; i<=range; i++)
                    val.push(i);
                return val;
            };
        })
        .controller("AlbumController", albumController);

    function albumController($location, $rootScope, SearchService, $sce, UserService)
    {
        var model = this;
        model.$location = $location;

        console.log("current rootScope login message is");
        console.log($rootScope.loginMessage);

        if ($rootScope.album != null) {
            console.log("In album page, current album is: ");
            console.log($rootScope.album);

            /*get all info for this album from database*/
            SearchService.findAlbumById($rootScope.album.id)
                .then(function (result) {
                    console.log("successfully found album");
                    model.album = result;

                    if  ($rootScope.user != null) {
                        UserService.findUserById($rootScope.user._id).then(function (user) {
                            console.log("view user");
                            console.log(user);
                            model.user = user;
                            setLikeStatus();
                        });
                    }

                    SearchService.findSongsByAlbum(model.album.id)
                        .then(function (result) {
                            console.log("successfully found songs");
                            model.songs = result.items;
                            console.log(model.songs);
                        });
                });
        }

        function setLikeStatus() {
            if ($rootScope.user != null) {
                UserService.findUserById($rootScope.user._id).then(function (user) {
                    $rootScope.user = user;
                    var albums = $rootScope.user.favoriteAlbums;
                    console.log("login user's favorite");
                    console.log($rootScope.user.favoriteAlbums);
                    console.log(model.album);
                    for (var i = 0; i < albums.length; i++) {
                        var album = albums[i];
                        if (album.id === model.album.id) {
                            console.log("found match album");
                            model.likeStatus = true;
                        }
                    }
                    if(model.likeStatus != true) {
                        model.likeStatus = false;
                    }
                    console.log("show like status: ");
                    console.log(model.likeStatus);
                });
            }
        }

        model.deleteAlbumFromUser = function() {
            UserService.deleteAlbumFromUser($rootScope.user._id, model.album.id)
                .then(function(result) {
                    console.log("delete album from the current login user")
                    console.log(result);
                    UserService.findUserById($rootScope.user._id).then(function (user) {
                        model.user = user;
                        setLikeStatus();
                    });
                });
        };
        model.millisToMinutesAndSeconds = function (millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        };

        model.saveSong = function (song) {
            $rootScope.song = song;
        };

        model.saveArtist = function (artist) {
            $rootScope.artist = artist;
        };

        model.saveLocation = function () {
            $rootScope.location = "/album";
        };

        model.addAlbumToUser = function ()
        {
            console.log("add album to current user: ");
            console.log($rootScope.user);
            UserService.addAlbumToUser($rootScope.user._id, model.album)
                .then(function(user) {
                    console.log("successfully added album to user");
                    console.log(user);
                })
        }

    }
})();