import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Button } from '@mui/material';
import TextField from "@mui/material/TextField"

import SongComponent from './SongComponent';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair, author } = props;
    const { auth } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");

    async function updateLikesAndDislikes() {
        store.getPlaylistById(idNamePair._id).then(
            (playlist) => {
                console.log("playlist: ", JSON.stringify(playlist, null, 3));
                setLikes(playlist.likes)
                setDislikes(playlist.dislikes)
            }
        )
    }

    useEffect(() => {
        if (isLoading) {
            console.log("loading likes and dislikes");
            updateLikesAndDislikes().then(
                () => {
                    setLoading(false);
                }
            )
        }
    }, [isLoading]);


    let icon = <KeyboardDoubleArrowDownIcon
        style={{ fontSize: '24pt' }}
    />;

    let likesNum;
    let dislikesNum;

    likesNum = isLoading ? "Loading..." : likes.length;
    dislikesNum = isLoading ? "Loading..." : dislikes.length;

    if (expanded) {
        icon = <KeyboardDoubleArrowUpIcon
            style={{ fontSize: '24pt' }}
        />;
    }

    function handleExpansion(event) {
        event.stopPropagation();
        console.log("Expanded Listcard " + idNamePair._id + " to " + !expanded);
        setExpanded(!expanded);
    }

    function handleLoadList(event, id) {
        if (event.detail === 2) {
            handleToggleEdit(event);
            return;
        }

        //console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            //console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    let likeColor = "black";
    let dislikeColor = "black";
    if (auth.user) {
        if (likes.includes(auth.user.userName)) {
            likeColor = "primary";
        }
        if (dislikes.includes(auth.user.userName)) {
            dislikeColor = "primary";
        }
    }

    function handleEdit(event) {
        event.stopPropagation();
        store.editPlaylist(idNamePair._id);
    }

    function handleLike(event) {
        event.stopPropagation();
        store.likePlaylist(idNamePair._id, auth.user.userName).then(
            () => {
                setLoading(true)
            }
        );
    }

    function handleDislike(event) {
        event.stopPropagation();
        store.dislikePlaylist(idNamePair._id, auth.user.userName).then(
            () => {
                setLoading(true)
            }
        );
    }

    let cardElement;

    let expandedSongs = <></>
    let expandedButtons = <div></div>


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

    let editView = <></>;


    if (editActive) {
        editView = <TextField
            margin="normal"
            required
            fullWidth
            id={"list-" + idNamePair._id}
            label="Playlist Name"
            name="name"
            autoComplete="Playlist Name"
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            defaultValue={idNamePair.name}
            inputProps={{ style: { fontSize: 48 } }}
            InputLabelProps={{ style: { fontSize: 24 } }}
            autoFocus
        />
        return editView;
    }

    if (expanded) {
        expandedSongs =
            <ListItem>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                    }}
                >
                    <Box sx={{
                        p: 1,
                        flexGrow: 1,
                    }}>
                        <SongComponent listId={idNamePair._id} />
                    </Box>
                </Box>
            </ListItem >

        expandedButtons =
            <Box sx={{ p: 1 }}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleEdit}
                    sx={{
                        backgroundColor: "#e3f2fd",
                    }}
                >
                    {'Edit'}
                </Button>
            </Box>
    }

    let cardColor = "#e3f2fd";
    if (store && store.currentList && store.currentList._id === idNamePair._id) {
        cardColor = '#e0f2f1';
    }

    cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: "10px",
                marginBottom: "1%",
                backgroundColor: cardColor,
            }}
            style={{ width: '98%', fontSize: '20pt' }}
            button
            onClick={(event) => {
                handleLoadList(event, idNamePair._id)
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <Box sx={{
                    p: 1,
                    flexGrow: 1,
                }}>
                    {idNamePair.name}
                </Box>
                <Button
                    sx={{
                        color: likeColor,
                    }}
                    onClick={handleLike}
                >
                    <ThumbUpIcon sx={{ p: 1 }} />
                </Button>
                {likesNum}
                <Button
                    sx={{
                        color: dislikeColor,
                    }}
                    onClick={handleDislike}
                >
                    <ThumbDownIcon sx={{ p: 1 }} />
                </Button>
                {dislikesNum}
            </Box>

            {/* Right here we have to display the songs within this list */}
            {expandedSongs}


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                }}
            >
                <Box
                    sx={{
                        p: 1,
                        flexGrow: 1,
                        fontSize: '12pt',
                    }}
                >
                    {'By:\t' + author}
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%'
                }}
            >
                {expandedButtons}
                <Box sx={{ p: 1 }}>
                    <IconButton
                        onClick={handleExpansion}
                        aria-label='expand'
                    >
                        {icon}
                    </IconButton>
                </Box>
            </Box>
        </ListItem>

    return (
        cardElement
    );
}

export default ListCard;