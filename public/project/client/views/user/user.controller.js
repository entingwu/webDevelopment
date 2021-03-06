"use strict";
(function() {
    angular
        .module("MusicPlayerApp")
        .controller('UserController', UserController);

    function UserController($scope, $location, $rootScope, UserService) {
        var model = this;
        model.$location = $location;
        model.saveAlbum = saveAlbum;
        model.saveArtist = saveArtist;
        model.saveTrack = saveTrack;
        model.deleteTrack = deleteTrack;
        model.deleteArtist = deleteArtist;
        model.deleteAlbum = deleteAlbum;

        if ($rootScope.user != null) {
            UserService
                .findUserById($rootScope.user._id)
                .then(function (user) {
                model.user = user;
                init();
            });
        }

        /*find current user's favorite tracks, artists, and albums from database*/
        function init() {
            UserService
                .findTracksByUserId(model.user._id)
                .then(function (tracks) {
                    model.user.tracks = tracks;
                    console.log("favorite tracks", model.user.tracks);
            });

            UserService
                .findArtistsByUserId(model.user._id)
                .then(function (artists) {
                    model.user.artists = artists;
                    console.log("favorite artists", model.user.artists);
            });

            UserService
                .findAlbumsByUserId(model.user._id)
                .then(function (albums) {
                    model.user.albums = albums;
                    console.log("found user's favorite albums", model.user.albums);
            });
        }

        function deleteTrack(track) {
            UserService
                .deleteTrackFromUser(model.user._id, track.id)
                .then(function (tracks) {
                UserService
                    .findTracksByUserId(model.user._id)
                    .then(function (result) {
                        model.user.tracks = result;
                    });
                console.log("Deleted track", model.user.tracks);
            });
        }

        function saveTrack(trackId) {
            $rootScope.track = {id: trackId};
        }

        function deleteArtist(artist) {
            UserService.deleteArtistFromUser(model.user._id, artist.id).then(function (artists) {
                UserService
                    .findArtistsByUserId(model.user._id)
                    .then(function (result) {
                        model.user.artists = result;
                    });
                console.log("Deleted artist", model.user.artists);
            });
        }

        function saveArtist(artistId) {
            $rootScope.artist = {id: artistId};
        }

        function deleteAlbum(album) {
            UserService.deleteAlbumFromUser(model.user._id, album.id).then(function (albums) {
                UserService
                    .findAlbumsByUserId(model.user._id)
                    .then(function (result) {
                        model.user.albums = result;
                    });
                console.log("Deleted album", model.user.albums);
            });
        }

        function saveAlbum(albumId) {
            $rootScope.album = {id: albumId};
        }

    }

})();
