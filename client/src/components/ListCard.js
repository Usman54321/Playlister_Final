import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// import SongComponent from './SongComponent';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [expanded, setExpanded] = useState(false);
    const { idNamePair, selected, likes, dislikes, author } = props;

    let icon = <KeyboardDoubleArrowDownIcon
        style={{ fontSize: '24pt' }}
    />;

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

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
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


    let cardElement;
    if (!expanded) {
        cardElement =
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    borderRadius: "10px",
                    marginLeft: "1%",
                    // border: "1px solid black",
                    marginBottom: "1%",
                    backgroundColor: "#e3f2fd",
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
                    <ThumbUpIcon sx={{ p: 1 }} />
                    {likes}
                    <ThumbDownIcon sx={{ p: 1 }} />
                    {dislikes}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <div></div>
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
                    <div></div>
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
    }
    else {
        // This is the expanded view of the list card
        cardElement =
            <ListItem
                id={idNamePair._id}
                key={idNamePair._id}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    borderRadius: "10px",
                    marginLeft: "1%",
                    // border: "1px solid black",
                    marginBottom: "1%",
                    backgroundColor: "#e3f2fd",
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
                    <ThumbUpIcon sx={{ p: 1 }} />
                    {likes}
                    <ThumbDownIcon sx={{ p: 1 }} />
                    {dislikes}
                </Box>

                {/* Right here we have to display the songs within this list */}
                

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <div></div>
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
                    <div></div>
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
    }

    if (editActive) {
        cardElement =
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
    }

    return (
        cardElement
    );
}

export default ListCard;