module.exports = function(mongoose) {
    var TrackSchema = mongoose.Schema({
        id: String,
        name: String,
        albumName: String,
        albumId: String,
        artistName: String,
        artistId: String,
        duration_ms: String,
        uri: String,
        popularity: String
    });

    return TrackSchema;
};