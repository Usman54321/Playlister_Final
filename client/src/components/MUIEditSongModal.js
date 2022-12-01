import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIEditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [title, setTitle] = useState(store.currentSong.title);
    const [artist, setArtist] = useState(store.currentSong.artist);
    const [youTubeId, setYouTubeId] = useState(store.currentSong.youTubeId);

    function handleConfirmEditSong() {
        let newSongData = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        store.addUpdateSongTransaction(store.currentSongIndex, newSongData);
    }

    function handleCancelEditSong() {
        store.hideModals();
    }

    function handleUpdateTitle(event) {
        setTitle(event.target.value);
    }

    function handleUpdateArtist(event) {
        setArtist(event.target.value);
    }

    function handleUpdateYouTubeId(event) {
        setYouTubeId(event.target.value);
    }

    return (
        <Modal
            open={store.currentSong !== null}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <header className="dialog-header">
                        Edit Song
                    </header>
                    <div id="edit-song-container">
                        <TextField
                            id="edit-song-title"
                            label="Title"
                            variant="standard"
                            value={title}
                            onChange={handleUpdateTitle}
                        />
                        <TextField
                            id="edit-song-artist"
                            label="Artist"
                            variant="standard"
                            value={artist}
                            onChange={handleUpdateArtist}
                        />
                        <TextField
                            id="edit-song-youtube-id"
                            label="YouTube ID"
                            variant="standard"
                            value={youTubeId}
                            onChange={handleUpdateYouTubeId}
                        />
                    </div>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={handleConfirmEditSong}
                        >Confirm</button>
                        <button
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={handleCancelEditSong}
                        >Cancel</button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}