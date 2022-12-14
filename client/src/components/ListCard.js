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

import SongCard from './SongCard';
import List from '@mui/material/List';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import SongComponent from './SongComponent';
import MUIRenameModal from './MUIRenameModal';

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
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [modalView, setModalView] = useState(false);
    const [isCurrentList, setIsCurrentList] = useState(false);


    let updateLikesAndDislikes = () => {
        // console.log("idNamePair with id " + idNamePair._id + " has likes: " + idNamePair.likes + " and dislikes: " + idNamePair.dislikes);
        setLikes(idNamePair.likes)
        setDislikes(idNamePair.dislikes)
    }

    useEffect(() => {
        if (idNamePair.published !== "None") {
            updateLikesAndDislikes();
        }
        let currList = store && store.currentList && idNamePair._id && store.currentList._id === idNamePair._id
        setIsCurrentList(currList);
        if (!currList && expanded) {
            // console.log("Listcard has id " + idNamePair._id + " and current list has id " + store.currentList._id + ".")
            // console.log("Listcard " + idNamePair._id + " is not current list, so closing it.")
            setExpanded(false);
        }
    }, [store.currentList, store.idNamePairs]);

    function handleExpansion(event) {
        event.stopPropagation();

        if (!expanded) {
            console.log("Listcard " + idNamePair._id + " is not expanded, so setting current list to it.")
            if (store.currentPage === "HOME") {
                store.setCurrentList(idNamePair._id);
            }
            else {
                console.log(store.currentPage);
                store.setCurrentListForCommunity(idNamePair._id);
            }
        }

        if (expanded && isCurrentList) {
            console.log("Listcard " + idNamePair._id + " is expanded and current list, so closing it.")
            event.stopPropagation();
            store.closeCurrentList();
        }

        console.log("Expanded Listcard " + idNamePair._id + " to " + !expanded);
        setExpanded(!expanded);
    }

    function handleLoadList(event, id) {
        if (event.detail === 2 && auth.user && idNamePair.ownerUserName === auth.user.userName && idNamePair.published === "None") {
            handleToggleEdit(event);
            return;
        }

        //console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            if (idNamePair.published === "None")
                store.setPlayingList(id, 0);
            else if (id === store.currentPlayingList)
                return;
            else {
                // store.setPlayingList(id);
                store.viewPlaylist(id);
            }
        }
    }

    function handleLike(event) {
        event.stopPropagation();
        store.likePlaylist(idNamePair._id, auth.user.userName);
    }

    function handleDislike(event) {
        event.stopPropagation();
        store.dislikePlaylist(idNamePair._id, auth.user.userName);
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
            // Go through store.idNamePairs to make sure that the name is unique
            let unique = true;
            for (const element of store.idNamePairs) {
                if (element._id !== idNamePair._id) {
                    if (element.name === text) {
                        unique = false;
                        break;
                    }
                }
            }
            if (unique) {
                let id = event.target.id.substring("list-".length);
                store.changeListName(id, text);
                toggleEdit();
            }
            else {
                setModalView(true);
            }
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleAddSong(event) {
        event.stopPropagation();
        event.preventDefault();
        store.addNewSong(idNamePair._id);
    }

    function handleUndo(event) {
        event.stopPropagation();
        store.undo();
    }

    function handleRedo(event) {
        event.stopPropagation();
        store.redo();
    }

    function handleDelete(event) {
        event.stopPropagation();
        store.markListForDeletion(idNamePair._id);
    }

    function handlePublish(event) {
        event.stopPropagation();
        setExpanded(false);
        store.publishPlaylist(idNamePair._id);
    }

    function handleDuplicate(event) {
        event.stopPropagation();
        store.duplicatePlaylist(idNamePair, auth.user.userName);
    }


    let icon = <KeyboardDoubleArrowDownIcon
        style={{ fontSize: '24pt' }}
    />;

    let likesNum;
    let dislikesNum;

    if (likes)
        likesNum = likes.length;
    if (dislikes)
        dislikesNum = dislikes.length;

    if (expanded && isCurrentList) {
        icon = <KeyboardDoubleArrowUpIcon
            style={{ fontSize: '24pt' }}
        />;
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

    let publishedLikesAndDislikes = <></>
    if (idNamePair.published !== "None") {
        publishedLikesAndDislikes = <>
            <Button
                sx={{
                    color: likeColor,
                }}
                onClick={handleLike}
                disabled={!auth.user}
            >
                <ThumbUpIcon sx={{ p: 1 }} />
            </Button>
            {likesNum}
            <Button
                sx={{
                    color: dislikeColor,
                }}
                onClick={handleDislike}
                disabled={!auth.user}
            >
                <ThumbDownIcon sx={{ p: 1 }} />
            </Button>
            {dislikesNum}
        </>
    }

    let publishedText = <></>
    if (idNamePair.published !== "None") {
        let date = new Date(idNamePair.published).toDateString();
        date = date.split(" ")
        date = date[1] + " " + date[2] + ", " + date[3];
        let views = idNamePair.views;
        publishedText = <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <Typography
                sx={{
                    fontSize: '10pt',
                    color: 'grey',
                    m: "8px"
                }}
            >
                {'Published: ' + date}
            </Typography>
            <Typography
                sx={{
                    fontSize: '10pt',
                    color: 'grey',
                }}
            >
                {'Listens: ' + views}
            </Typography>
        </Box>
    }

    let cardElement;

    let expandedSongs = <></>
    let expandedButtons = <></>


    let editView = <></>;


    if (editActive) {
        console.log("modalView: " + modalView)
        editView =
            <>
                <MUIRenameModal
                    displayVal={modalView}
                    displayValSetter={setModalView}
                />
                <TextField
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
            </>
        return editView;
    }

    let publishedDeleteButton = <></>
    if (store.currentPage === "HOME") {
        publishedDeleteButton = <Button
            color="primary"
            variant="outlined"
            onClick={handleDelete}
            disabled={auth.user === null}
            sx={{
                backgroundColor: "#e3f2fd",
                mr: "1.5%"
            }}
        >
            {'Delete'}
        </Button>
    }

    if (expanded && isCurrentList && idNamePair.published === "None") {
        expandedSongs =
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    maxHeight: "408px",
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
                        idNamePair.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                                playlistID={idNamePair._id}
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
                                    '&:hover': {
                                        backgroundColor: "#e1f5fe"
                                    }
                                }}
                                onClick={handleAddSong}
                            >
                                <AddIcon />
                            </Button>
                        </Box>
                    </ListItem>
                </List>
            </Box>

        expandedButtons =
            <>
                <Box sx={{
                    p: 1,
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleUndo}
                        sx={{
                            backgroundColor: "#e3f2fd",
                            mr: "1.5%"
                        }}
                        disabled={store.isModalOpen()}
                    >
                        {'Undo'}
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleRedo}
                        sx={{
                            backgroundColor: "#e3f2fd",
                        }}
                        disabled={store.isModalOpen()}
                    >
                        {'Redo'}
                    </Button>
                </Box>

                <Box sx={{
                    p: 1,
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleDelete}
                        sx={{
                            backgroundColor: "#e3f2fd",
                            mr: "1.5%"
                        }}
                        disabled={store.isModalOpen()}
                    >
                        {'Delete'}
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handlePublish}
                        sx={{
                            backgroundColor: "#e3f2fd",
                            mr: "1.5%"
                        }}
                        disabled={store.isModalOpen()}
                    >
                        {'Publish'}
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleDuplicate}
                        sx={{
                            backgroundColor: "#e3f2fd",
                        }}
                        disabled={store.isModalOpen()}
                    >
                        {'Duplicate'}
                    </Button>

                </Box>
            </>
    }

    else if (expanded && isCurrentList && idNamePair.published !== "None") {
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    width: '100%'
                }}
            >
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleDuplicate}
                    disabled={auth.user === null}
                    sx={{
                        backgroundColor: "#e3f2fd",
                    }}
                >
                    {'Duplicate'}
                </Button>

                {publishedDeleteButton}

            </Box>

    }

    let cardColor = "#e3f2fd";
    if (store && store.currentPlayingList && store.currentPlayingList === idNamePair._id) {
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
                marginLeft: "1%",
                alignItems: 'normal',
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
                {publishedLikesAndDislikes}
            </Box>

            {/* Right here we have to display the songs within this list */}
            {expandedSongs}


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    fontSize: '12pt',
                    p: 1,
                }}
            >
                <p
                    style={{
                        cursor: 'pointer',
                        color: 'blue',
                        textDecoration: 'underline',
                        margin: 0,
                    }}
                    onClick={(event) => {
                        event.stopPropagation();
                        store.markAuthorForSeach(author)
                    }}
                >
                    {'By:\t' + author}
                </p>
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
            </Box>

            {publishedText}


            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: '100%'
                }}
            >
                <IconButton
                    onClick={handleExpansion}
                    aria-label='expand'
                >
                    {icon}
                </IconButton>
            </Box>
        </ListItem>

    return (
        cardElement
    );
}

export default ListCard;