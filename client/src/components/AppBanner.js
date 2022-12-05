import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link to='/login/'>
                <MenuItem onClick={handleMenuClose}>
                    Login
                </MenuItem>
            </Link>
            <Link to='/register/'>
                <MenuItem onClick={handleMenuClose}>
                    Create New Account
                </MenuItem>
            </Link>
            <Link to='#'>
                <MenuItem
                    onClick={() => {
                        auth.loginAsGuest();
                    }}
                >
                    Continue As Guest
                </MenuItem>
            </Link>
        </Menu >
    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList && store.currentPage === "EDIT_LIST") {
            editToolbar = <EditToolbar />;
        }
    }

    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        //console.log("userInitials: " + userInitials);
        if (loggedIn)
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
            }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '64px'
            }}
        >
            <AppBar
                position="static"
                style={{ backgroundColor: '#e3f2fd', borderRadius: '10px 10px 10px 10px' }}
            >
                <Toolbar>
                    <img
                        src="/playlister.png"
                        alt="Playlister Logo"
                        height={"50px"}
                        onClick={() => {
                            if (auth && store && auth.loggedIn && store.currentPage !== "HOME") {
                                store.setPage("HOME");
                                // console.log('Setting page to HOME');
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                    />
                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="#b1bfca"
                        >
                            {getAccountMenu(auth.loggedIn)}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}