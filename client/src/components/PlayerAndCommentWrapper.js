import YouTube from 'react-youtube';
import CommentSection from './CommentSection';
import { useState, useContext, useEffect } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import StopSharpIcon from '@mui/icons-material/StopSharp';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GlobalStoreContext from '../store';


export default function PlayerAndCommentWrapper() {
    const { store } = useContext(GlobalStoreContext);
    const [currentView, setCurrentView] = useState("player");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [YT, setYTPlayer] = useState(null);
    const [list, setList] = useState(null);

    useEffect(() => {
        if (store.currentPage === "HOME" && store.currentPlayingList) {
            let hasListChanged = false;
            if (list && store.currentPlayingList !== list._id) {
                hasListChanged = true;
            }
            store.getPlaylistById(store.currentPlayingList).then(
                (playlist) => {
                    console.log("Playlist: ", playlist)
                    setList(playlist);
                    if (hasListChanged)
                        setCurrentIndex(0);
                }
            )
        }
        else if (store.currentPlayingList) {
            let hasListChanged = false;
            if (list && store.currentPlayingList !== list._id) {
                hasListChanged = true;
            }
            store.getPublicPlaylistByID(store.currentPlayingList).then(
                (playlist) => {
                    console.log("Playlist: ", playlist)
                    setList(playlist);
                    if (hasListChanged)
                        setCurrentIndex(0);
                }
            )
        }
    }, [store.currentPlayingList, store.idNamePairs, store.currentPage]);

    let playerColor = currentView === "player" ? "white" : "#b1bfca";
    let commentColor = currentView === "comment" ? "white" : "#b1bfca";

    let _onReady = (event) => {
        // access to player in all event handlers via event.target
        setYTPlayer(event.target);
        console.log("Setting YT to: ", YT);
    }

    let _onStateChange = (event) => {
        // If the video has ended, play the next video
        if (event.data === 0) {
            console.log("Video has ended");
            if (currentIndex < songs.length - 1) {
                setCurrentIndex(currentIndex + 1);
                // YT.playVideo();
            }
        }
    }

    let handleStop = () => {
        console.log("YT: ", YT);
        if (YT)
            YT.pauseVideo();
    }

    let handlePlay = () => {
        console.log("YT: ", YT);
        if (YT)
            YT.playVideo();
    }


    let playerBody;
    let songs = list && list.songs && list.songs.length > 0 ? list.songs : null;
    let currentSong = songs ? songs[currentIndex] : null;
    let currentYTID;
    let playlistName = "";
    let songTitle = "";
    let songArtist = "";
    let index = currentIndex + 1;

    if (!songs && !currentSong) {
        // console.log("No songs in playlist");
        currentYTID = null;
        index = "";
    }
    else if (songs && !currentSong) {
        // You try to find a current song by resetting the index to 0
        setCurrentIndex(0);
    }
    else {
        currentYTID = currentSong.youTubeId;
        playlistName = list.name;
        songTitle = currentSong.title;
        songArtist = currentSong.artist;
    }

    let ytBody = <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            height: "360px",
            justifyContent: "center",
            alignItems: "center",
        }}
    >
    </Box>


    if (currentYTID) {
        ytBody =
            <YouTube
                videoId={currentYTID}
                opts={{
                    width: '80%',
                    height: '360px',
                    playerVars: {
                        autoplay: 1,
                    },
                }}
                onReady={_onReady}
                onStateChange={_onStateChange}

            />
    }

    let playerBodyDisplay = currentView === "player" ? "inline" : "none";
    let commentBodyDisplay = currentView === "comment" ? "flex" : "none";

    let rewindDisabled = false;
    if (currentIndex === 0) {
        rewindDisabled = true;
    }
    else if (!songs) {
        rewindDisabled = true;
    }

    let forwardDisabled = false;
    if (songs) {
        if (currentIndex === songs.length - 1) {
            forwardDisabled = true;
        }
    }
    else {
        forwardDisabled = true;
    }

    playerBody =
        <div
            style={{
                display: playerBodyDisplay,
            }}
        >
            {ytBody}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "80%",
                }}>
                <p
                    style={{ margin: "0px 0px 0px 0px" }}
                >
                    {'Now Playing'}
                </p>
            </div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                }}
            >
                <p
                    style={{ margin: "0px 0px 0px 0px" }}
                >
                    {'Playlist: ' + playlistName}
                </p>
                <p
                    style={{ margin: "0px 0px 0px 0px" }}
                >
                    {'Song #: ' + index}
                </p>
                <p
                    style={{ margin: "0px 0px 0px 0px" }}
                >
                    {'Title: ' + songTitle}
                </p>
                <p
                    style={{ margin: "0px 0px 0px 0px" }}
                >
                    {'Artist: ' + songArtist}
                </p>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "80%",
                }}
            >
                {/* Rewind Button */}
                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    disabled={rewindDisabled}
                    onClick={() => {
                        if (currentIndex > 0) {
                            setCurrentIndex(currentIndex - 1);
                        }
                    }}
                >
                    <SkipPreviousIcon />
                </IconButton>

                {/* Stop Button */}
                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    onClick={handleStop}
                    disabled={currentYTID === null || songs.length === 0}
                >
                    <StopSharpIcon />
                </IconButton>

                {/* Play Button */}
                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    onClick={handlePlay}
                    disabled={currentYTID === null || songs.length === 0}
                >
                    <PlayArrowIcon />
                </IconButton>

                {/* Fast Forward Button */}
                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    disabled={forwardDisabled}
                    onClick={() => {
                        if (currentIndex < songs.length - 1) {
                            setCurrentIndex(currentIndex + 1);
                        }
                    }}
                >
                    <SkipNextIcon />
                </IconButton>
            </Box>
        </div>

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                marginLeft: "1%",
                paddingTop: "8px"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "max-content",
                }}
            >
                <Button
                    variant="outlined"
                    sx={{ color: "black", backgroundColor: playerColor, borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}
                    onClick={() => {
                        setCurrentView("player");
                    }}
                >
                    {'Player'}
                </Button>
                <Button
                    variant="outlined"
                    sx={{ color: "black", backgroundColor: commentColor, borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }}
                    onClick={() => {
                        setCurrentView("comment");
                    }}
                >
                    {'Comments'}
                </Button>
            </Box>
            {/* {currentView === "player" ? playerBody : <CommentSection />} */}
            {playerBody}
            <CommentSection
                display={commentBodyDisplay}
            />
        </Box>
    );
}