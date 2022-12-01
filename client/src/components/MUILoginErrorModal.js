import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import {useContext} from 'react';
import AuthContext from '../auth';

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

export default function MUILoginErrorModal() {
    const { auth } = useContext(AuthContext);

    let errorMsg = "";
    // Check if the auth.loginError string length is greater than 0
    if (auth.loginError.length > 0) {
        errorMsg = auth.loginError;
    }

    function handleCloseModal() {
        auth.closeErrorModal();
    }

    return (
        <Modal
            open={auth.loginError.length > 0}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                    <header className="dialog-header">
                        <Alert severity="error">{errorMsg}</Alert>
                    </header>
                    <div id="confirm-cancel-container">
                        <Button
                            id="login-error-ok-button"
                            variant='contained'
                            className="modal-button"
                            onClick={handleCloseModal}
                        >OK</Button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}