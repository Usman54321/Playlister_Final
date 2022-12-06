// import { useContext } from 'react'
// import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIRenameModal(props) {
    // const { store } = useContext(GlobalStoreContext);
    let displayVal = props.displayVal;
    let displayValSetter = props.displayValSetter;

    function handleCloseModal(event) {
        event.stopPropagation();
        displayValSetter(false)
        console.log("Pressed close button")
        console.log("DisplayVal is now: " + displayVal)
    }

    return (
        <Modal
            open={displayVal}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <header className="dialog-header">
                        This playlist name is already taken!
                    </header>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={handleCloseModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}