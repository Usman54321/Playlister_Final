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
    const [currentView, setCurrentView] = useState("player");
    const [currentIndex, setCurrentIndex] = useState(0);
    let playerColor = currentView === "player" ? "white" : "#b1bfca";
    let commentColor = currentView === "comment" ? "white" : "#b1bfca";
    const { store } = useContext(GlobalStoreContext);

    let YT = null;
    let _onReady = (event) => {
        // access to player in all event handlers via event.target
        YT = event.target;
    }

    let handleStop = () => {
        YT.stopVideo();
    }

    let handlePlay = () => {
        YT.playVideo();
    }


    let playerBody;
    let songs = store.currentList ? store.currentList.songs : [];
    let currentSong = songs ? songs[currentIndex] : null;
    let currentYTID;
    let playlistName = "";
    let songTitle = "";
    let songArtist = "";
    let index = currentIndex + 1;

    if (songs.length === 0 && currentSong === undefined) {
        console.log("No songs in playlist");
        currentYTID = null;
        index = "";
    } else {
        currentYTID = currentSong.youTubeId;
        playlistName = store.currentList.name;
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
                }}
                onReady={_onReady}
            />
    }

    playerBody =
        <>
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
                    disabled={currentIndex === 0 || songs.length === 0}
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
                    disabled={currentIndex === songs.length - 1 || songs.length === 0}
                    onClick={() => {
                        if (currentIndex < songs.length - 1) {
                            setCurrentIndex(currentIndex + 1);
                        }
                    }}
                >
                    <SkipNextIcon />
                </IconButton>
            </Box>
        </>

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                marginLeft: "1%",
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
            </ Box>
            {currentView === "player" ? playerBody : <CommentSection />}
        </Box>
    );
}