import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'


import { List, Box } from '@mui/material';

import Navbar from './Navbar';
import PlayerAndCommentWrapper from './PlayerAndCommentWrapper.js'
import AuthContext from '../auth';
import { useHistory } from 'react-router-dom';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const CommunityView = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        if (!auth || !auth.loggedIn) {
            store.clearIDNamePairs();
            history.push("/");
        }
        store.loadIdNamePairsForCommunity();
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
                            author={pair.ownerUserName}
                        />
                    ))
                }
            </List>;
    }

    // let modalJSX = "";
    // if (store.isEditSongModalOpen()) {
    //     modalJSX = <MUIEditSongModal />;
    // }
    // else if (store.isRemoveSongModalOpen()) {
    //     modalJSX = <MUIRemoveSongModal />;
    // }
    // else if (store.isDeleteListModalOpen()) {
    //     modalJSX = <MUIDeleteModal />;
    // }

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
                    </div>
                </div>

                <PlayerAndCommentWrapper />
            </Box>
        </>
    );
}

export default CommunityView;