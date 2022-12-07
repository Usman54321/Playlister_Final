import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import { List, Box } from '@mui/material';

import Navbar from './Navbar';
import PlayerAndCommentWrapper from './PlayerAndCommentWrapper.js'
import MUIEditSongModal from "./MUIEditSongModal"
import MUIRemoveSongModal from "./MUIRemoveSongModal"
import AuthContext from '../auth';
import { useState } from 'react';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [idNamePairs, setIdNamePairs] = useState([])
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        if (firstLoad) {
            store.loadIdNamePairs();
            setFirstLoad(false)
            return;
        }
        setIdNamePairs(store.idNamePairs)
    }, [store.idNamePairs]);

    let listCard = "";
    if (store && store.idNamePairs.length > 0) {
        listCard =
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'transparent',
                    borderRadius: "10px",
                }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            author={pair.ownerUserName}
                        />
                    ))
                }
            </List>;
    }

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if (store.isDeleteListModalOpen()) {
        modalJSX = <MUIDeleteModal />;
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
                    height: auth && auth.user ? "80%" : "90%",
                }}
            >
                <div id="playlist-selector"
                    style={{ height: "90%", width: "50%" }}
                >
                    <div id="list-selector-list">
                        {listCard}
                        <MUIDeleteModal />
                    </div>
                </div>

                <PlayerAndCommentWrapper />
            </Box>
            {modalJSX}
        </>
    );
}

export default HomeScreen;