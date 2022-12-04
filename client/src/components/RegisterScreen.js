import { useContext } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MUILoginErrorModal from './MUILoginErrorModal'
import { Paper } from '@mui/material';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        auth.registerUser(
            formData.get('firstName'),
            formData.get('lastName'),
            formData.get('email'),
            formData.get('userName'),
            formData.get('password'),
            formData.get('passwordVerify')
        );
    };

    // We need to rewrite the above code to use Box instead of Grid
    return (
        <Paper
            elevation={0}
            sx={{
                backgroundColor: '#f5f5f5',
                height: '100vh',
            }}
        >
            <MUILoginErrorModal />
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    // justifyContent: 'center',
                    height: '100vh',
                    marginTop: 8,
                }}
            >
                <Avatar
                    sx={{
                        m: 1,
                        bgcolor: 'secondary.main',
                    }}
                >
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                {/* This next Box will have a flexbox with rows
                It is responsible for containing first and last name text fields */}
                <Box
                    sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <TextField
                        autoComplete="fname"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        sx={{
                            width: '48%',
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="lname"
                        sx={{
                            width: '48%',
                        }}
                    />
                </Box>

                {/* This next TextField will ask for the email */}
                <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    sx={{
                        mt: 1,
                        width: '29.8%',
                    }}
                />
                {/* This next TextField will ask for the username */}
                <TextField
                    required
                    fullWidth
                    id="userName"
                    label="Username"
                    name="userName"
                    autoComplete="userName"
                    sx={{
                        mt: 1,
                        width: '29.8%',
                    }}
                />
                {/* This next TextField will ask for the password */}
                <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    sx={{
                        mt: 1,
                        width: '29.8%',
                    }}
                />
                {/* This next TextField will ask for the password verification */}
                <TextField
                    required
                    fullWidth
                    name="passwordVerify"
                    label="Password Verify"
                    type="password"
                    id="passwordVerify"
                    autoComplete="new-password"
                    sx={{
                        mt: 1,
                        width: '29.8%',
                    }}
                />
                {/* This next Button will submit the form */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        mb: 2,
                        width: '29.8%',
                    }}
                >
                    Sign Up
                </Button>
                {/* This next Box will contain the link to the login page */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Link href="/login/" variant="body2">
                        Already have an account? Sign in
                    </Link>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Box>
        </Paper>
    );

}