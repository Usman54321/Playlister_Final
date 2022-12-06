const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
    const body = req.body;
    // console.log("createPlaylist body: " + JSON.stringify(body, null, 3));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }

    const playlist = new Playlist(body);
    // console.log("playlist: " + playlist.toString());
    if (!playlist) {
        return res.status(400).json({ success: false, error: err })
    }

    User.findOne({ _id: req.userId }, (err, user) => {
        // console.log("user found: " + JSON.stringify(user, null, 3));
        user.playlists.push(playlist._id);
        user
            .save()
            .then(() => {
                playlist
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            playlist: playlist
                        })
                    })
                    .catch(error => {
                        console.log("createPlaylist error : " + error);
                        return res.status(400).json({
                            errorMessage: 'Playlist Not Created!',
                        })
                    })
            });
    })
}

deletePlaylist = async (req, res) => {
    //console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
    //console.log("delete " + req.params.id);
    Playlist.findById({ _id: req.params.id }, (err, playlist) => {
        //console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                errorMessage: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            User.findOne({ userName: list.ownerUserName }, (err, user) => {
                //console.log("user._id: " + user._id);
                //console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    //console.log("correct user!");
                    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
                        return res.status(200).json({ success: true })
                    }).catch(err => console.log("deletePlaylist error: " + err))
                    // Delete the playlist from the user's list of playlists
                    let index = user.playlists.indexOf(req.params.id);
                    if (index > -1) {
                        user.playlists.splice(index, 1);
                    }
                    user.save().catch(err => console.log("deletePlaylist error: " + err));
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({
                        errorMessage: "authentication error"
                    });
                }
            });
        }
        asyncFindUser(playlist);
    })
}

getPlaylistById = async (req, res) => {
    // console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        // console.log("Found list: " + JSON.stringify(list));

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ userName: list.ownerUserName }, (err, user) => {
                // console.log("user._id: " + user._id);
                // console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    // console.log("correct user!");
                    return res.status(200).json({ success: true, playlist: list })
                }
                else {
                    // console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }

        // if (list.published === "None") {
        asyncFindUser(list);
        // }
        // else {
        // console.log("This list with ID " + req.params.id + " is published!");
        // return res.status(200).json({ success: true, playlist: list })
        // }
    }).catch(err => console.log("getPlaylistById error: " + err))
}

getPlaylistPairs = async (req, res) => {
    // console.log("getPlaylistPairs");
    await User.findOne({ _id: req.userId }, (err, user) => {
        // console.log("find user with id " + req.userId);
        async function asyncFindList(userName) {
            // console.log("find all Playlists owned by " + userName);
            await Playlist.find({ ownerUserName: userName }, (err, playlists) => {
                // console.log("found Playlists: " + JSON.stringify(playlists));
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                if (!playlists) {
                    //console.log("!playlists.length");
                    return res
                        .status(404)
                        .json({ success: false, error: 'Playlists not found' })
                }
                else {
                    //console.log("Send the Playlist pairs");
                    // PUT ALL THE LISTS INTO ID, NAME PAIRS
                    // let pairs = [];
                    // for (let key in playlists) {
                    //     let list = playlists[key];
                    //     let pair = {
                    //         _id: list._id,
                    //         name: list.name,
                    //         ownerUserName: list.ownerUserName,
                    //         // likes: list.likes,
                    //         // dislikes: list.dislikes
                    //     };
                    //     pairs.push(pair);
                    // }
                    return res.status(200).json({ success: true, idNamePairs: playlists })
                }
            }).catch(err => console.log("getPlaylistPairs error: " + err))
        }
        asyncFindList(user.userName);
    }).catch(err => console.log("getPlaylistPairs error :" + err))
}

getPlaylists = async (req, res) => {
    await Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log("getPlaylists error: " + err))
}

updatePlaylist = async (req, res) => {
    const body = req.body
    // console.log("updatePlaylist: " + JSON.stringify(body));
    // console.log("req.body.name: " + req.body.playlist.name);

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        // console.log("playlist found: " + JSON.stringify(playlist));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // DOES THIS LIST BELONG TO THIS USER?
        async function asyncFindUser(list) {
            await User.findOne({ userName: list.ownerUserName }, (err, user) => {
                // console.log("user._id: " + user._id);
                // console.log("req.userId: " + req.userId);
                if (user._id == req.userId) {
                    // console.log("correct user!");
                    // console.log("req.body.name: " + req.body.name);

                    list.name = body.playlist.name;
                    list.songs = body.playlist.songs;
                    list.likes = body.playlist.likes;
                    list.dislikes = body.playlist.dislikes;
                    list.comments = body.playlist.comments;
                    list.published = body.playlist.published;
                    list
                        .save()
                        .then(() => {
                            //console.log("SUCCESS!!!");
                            return res.status(200).json({
                                success: true,
                                id: list._id,
                                message: 'Playlist updated!',
                            })
                        })
                        .catch(error => {
                            console.log("FAILURE: " + JSON.stringify(error, null, 3));
                            return res.status(404).json({
                                error,
                                message: 'Playlist not updated!',
                            })
                        })
                }
                else {
                    console.log("incorrect user!");
                    return res.status(400).json({ success: false, description: "authentication error" });
                }
            });
        }
        asyncFindUser(playlist);
    })
}

getPlaylistPairsCommunity = async (req, res) => {
    // Get all playlists that's .published !== "None"
    await Playlist.find({ published: { $ne: "None" } }, (err, playlists) => {
        return res.status(200).json({ success: true, idNamePairs: playlists })
    }).catch(err => console.log("getPlaylistPairsCommunity error: " + err))
}

updatePublicFeatures = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Playlist not found!',
            })
        }

        // We don't need to care if the list belongs to this user if we're just updating likes/dislikes
        // Just make sure the list is published
        if (playlist.published !== "None") {
            playlist.likes = body.playlist.likes;
            playlist.dislikes = body.playlist.dislikes;
            playlist.views = body.playlist.views;
            playlist.comments = body.playlist.comments;
            playlist
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: playlist._id,
                        message: 'Playlist updated!',
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Playlist not updated!',
                    })
                })
        }
        else {
            return res.status(400).json({ success: false, description: "Updating List that's not published" });
        }
    })
}

getPublicPlaylistByID = async (req, res) => {
    await Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (list.published === "None") {
            return res.status(400).json({ success: false, error: "List is not published" });
        }
        else {
            // console.log("This list with ID " + req.params.id + " is published!");
            return res.status(200).json({ success: true, playlist: list })
        }
    }).catch(err => console.log("getPlaylistById error: " + err))
}

module.exports = {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getPlaylistPairs,
    getPlaylists,
    updatePlaylist,
    getPlaylistPairsCommunity,
    updatePublicFeatures,
    getPublicPlaylistByID
}