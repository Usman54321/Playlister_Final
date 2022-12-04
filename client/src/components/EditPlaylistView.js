import Navbar from "./Navbar"
import { Box, ListItem, Typography } from "@mui/material"
import PlayerAndCommentWrapper from "./PlayerAndCommentWrapper"
import { GlobalStoreContext } from '../store'
import { useContext, useState } from "react"
import SongCard from "./SongCard"
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import MUIEditSongModal from "./MUIEditSongModal"
import MUIRemoveSongModal from "./MUIRemoveSongModal"
import IconButton from "@mui/material/IconButton"
import EditIcon from '@mui/icons-material/Edit';
import TextField from "@mui/material/TextField"

export default function EditPlaylistView() {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");


    let currentList = store.currentList;
    console.log("currentList: " + JSON.stringify(currentList, null, 3));

    function handleAddSong(event) {
        event.stopPropagation();
        event.preventDefault();
        store.addNewSong();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    let nameElement = "";
    if (store && currentList)
        nameElement = <Typography
            sx={{
                fontSize: "20pt",
                fontWeight: "bold",
                marginLeft: "5%",
                marginTop: "2%",
            }}
        >
            {currentList.name}
        </Typography>

    if (editActive && currentList !== null) {
        nameElement = <TextField
            margin="normal"
            required
            fullWidth
            id={"list-" + currentList._id}
            label="Playlist Name"
            name="name"
            autoComplete="Playlist Name"
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={currentList.name}
            inputProps={{ style: { fontSize: 48 } }}
            InputLabelProps={{ style: { fontSize: 24 } }}
            autoFocus
        />
    }

    return <>
        <Navbar />
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "2%",
                height: "100%",
            }}
        >

            <div
                style={{ height: "90%", width: "100%" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#f5f5f5",
                        height: "80%",
                        width: "100%",
                        left: '5%',
                        marginBottom: "1%",
                        borderRadius: "10px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        {nameElement}
                        <IconButton
                            sx={{
                                marginRight: "2%",
                                marginTop: "2%",
                            }}
                            onClick={handleToggleEdit}
                            aria-label='edit'>
                            <EditIcon style={{ fontSize: '20pt' }} />
                        </IconButton>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "12pt",
                            marginLeft: "5%",
                            marginTop: "2%",
                        }}
                    >
                        {'By:\t' + currentList.ownerUserName}
                    </Typography>

                    {/* Now we map songcards */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            width: "100%",
                            marginTop: "2%",
                        }}
                    >
                        <List
                            id="playlist-cards"
                            sx={{
                                width: '98%',
                                bgcolor: '#b1bfca',
                                left: '1%',
                                borderRadius: "10px",
                                overflowY: 'auto',
                            }}
                        >
                            {
                                currentList.songs.map((song, index) => (
                                    <SongCard
                                        id={'playlist-song-' + (index)}
                                        key={'playlist-song-' + (index)}
                                        index={index}
                                        song={song}
                                    />
                                ))
                            }
                            {/* We need a + button to add a new Song */}
                            <ListItem>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        height: "100%",
                                        width: "100%",
                                        marginTop: "2%",
                                    }}
                                >
                                    <Button
                                        sx={{
                                            fontSize: "12pt",
                                            fontWeight: "bold",
                                            borderRadius: "10px",
                                            color: "black",
                                            backgroundColor: "#e3f2fd",
                                            width: "100%",
                                        }}
                                        onClick={handleAddSong}
                                    >
                                        <AddIcon />
                                    </Button>
                                </Box>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </div>

            <PlayerAndCommentWrapper />
            {modalJSX}
        </Box>
    </>
}