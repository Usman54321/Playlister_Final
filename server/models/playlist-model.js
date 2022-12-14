const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerUserName: { type: String, required: true },
        likes: {
            type: [{
                type: String
            }], required: true, default: []
        },
        dislikes: {
            type: [{
                type: String
            }], required: true, default: []
        },
        published: { type: String, required: true },
        comments: {
            type: [{
                userName: String,
                comment: String,
            }], required: true
        },
        views: { type: Number, required: true },
        songs: {
            type: [{
                title: String,
                artist: String,
                youTubeId: String
            }], required: true
        }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
