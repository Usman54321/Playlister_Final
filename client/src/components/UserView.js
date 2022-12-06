// export default function UserView() {
//     return <></>
// }


// export default function CommunityView() {
//     return <></>
// }

import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'

// import AddIcon from '@mui/icons-material/Add';
// import Fab from '@mui/material/Fab'
// import List from '@mui/material/List';
// import Typography from '@mui/material/Typography'
// import Box from '@mui/material/Box'

import { List, Box } from '@mui/material';

import Navbar from './Navbar';
import PlayerAndCommentWrapper from './PlayerAndCommentWrapper.js'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const UserView = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.clearIDNamePairs();
    }, []);

    let listCard = "";
    if (store && store.idNamePairs && store.idNamePairs.length > 0) {
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
                    height: "80%",
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

export default UserView;