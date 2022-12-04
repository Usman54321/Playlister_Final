import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

// import AddIcon from '@mui/icons-material/Add';
// import Fab from '@mui/material/Fab'
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography'
// import Box from '@mui/material/Box'

import { Fab, List, Typography, Box } from '@mui/material';

import Navbar from './Navbar';
import PlayerAndCommentWrapper from './PlayerAndCommentWrapper.js'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let listCard = "";
    if (store && store.idNamePairs.length > 0) {
        listCard =
            <List
                sx={{
                    width: '100%',
                    // left: '5%',
                    // bgcolor: 'background.paper',
                    bgcolor: 'transparent',
                    borderRadius: "10px",
                }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                            likes={pair.likes}
                            dislikes={pair.dislikes}
                            author={pair.ownerUserName}
                        />
                    ))
                }
            </List>;
    }
    return (
        <>
            <Navbar />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "1%",
                    height: "80%",
                }}
            >
                <div id="playlist-selector"
                    style={{ height: "90%", width: "100%" }}
                >
                    <div id="list-selector-list">
                        {listCard}
                        <MUIDeleteModal />
                    </div>
                </div>

                <PlayerAndCommentWrapper />
            </Box>
        </>
    );
}

export default HomeScreen;