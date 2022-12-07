import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import { List, Box } from '@mui/material';

import Navbar from './Navbar';
import PlayerAndCommentWrapper from './PlayerAndCommentWrapper.js'
import MUIEditSongModal from "./MUIEditSongModal"
import MUIRemoveSongModal from "./MUIRemoveSongModal"
import AuthContext from '../auth';

import { useHistory } from 'react-router-dom';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [idNamePairs, setIdNamePairs] = useState([])
    const [firstLoad, setFirstLoad] = useState(true)
    const history = useHistory();

    useEffect(() => {
        if (!auth || !auth.loggedIn) {
            store.clearIDNamePairs();
            history.push("/");
        }
        if (firstLoad) {
            store.loadIdNamePairs();
            setFirstLoad(false)
            return;
        }
        setIdNamePairs(store.idNamePairs)
    }, [store.idNamePairs]);

    let listCard = "";
    if (idNamePairs && idNamePairs.length > 0) {
        listCard =
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'transparent',
                    borderRadius: "10px",
                }}>
                {
                    idNamePairs.map((pair) => (
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