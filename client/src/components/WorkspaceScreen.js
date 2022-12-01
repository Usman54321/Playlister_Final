import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    if (!store.currentList) {
        return (
            <></>
        );
    }

    // Register a CTRL-Z and CTRL-Y keypress handler
    document.onkeydown = function (e) {
        if (e.ctrlKey && e.key === 'z' && !store.isModalOpen()) {
            store.undo();
        }
        else if (e.ctrlKey && e.key === 'y' && !store.isModalOpen()) {
            store.redo();
        }
    }

    return (
        <div 
        style={{height: "83%", overflow: "auto"}}
        >
            <Box>
                <List
                    id="playlist-cards"
                    sx={{ width: '100%', bgcolor: 'background.paper' }}
                >
                    {
                        store.currentList.songs.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index)}
                                key={'playlist-song-' + (index)}
                                index={index}
                                song={song}
                            />
                        ))
                    }
                </List>
                {modalJSX}
            </Box>
        </div>
    )
}

export default WorkspaceScreen;