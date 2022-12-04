import Player from './Player';
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

    let playerBody;
    if (store.currentList === null) {
        playerBody =
            <h2>
                {'No Playlist Selected'}
            </h2>
    }
    else {
        let songs = store.currentList.songs;
        let currentSong = songs[currentIndex];
        let currentYTID;
        if (songs.length === 0 && currentSong === undefined) {
            console.log("No songs in playlist");
            currentYTID = null;
        } else
            currentYTID = currentSong.youTubeId;

        playerBody =
            <>
                <Player
                    id={currentYTID}
                />
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
                        {'Playlist: ' + store.currentList.name}
                    </p>
                    <p
                        style={{ margin: "0px 0px 0px 0px" }}
                    >
                        {'Song #: ' + (currentIndex + 1)}
                    </p>
                    <p
                        style={{ margin: "0px 0px 0px 0px" }}
                    >
                        {'Title: ' + currentSong.title}
                    </p>
                    <p
                        style={{ margin: "0px 0px 0px 0px" }}
                    >
                        {'Artist: ' + currentSong.artist}
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
                        disabled={currentIndex === 0}
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
                    >
                        <StopSharpIcon />
                    </IconButton>

                    {/* Play Button */}
                    <IconButton
                        size="large"
                        style={{ textDecration: 'none', color: 'black' }}
                    >
                        <PlayArrowIcon />
                    </IconButton>

                    {/* Fast Forward Button */}
                    <IconButton
                        size="large"
                        style={{ textDecration: 'none', color: 'black' }}
                        disabled={currentIndex === songs.length - 1}
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
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
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