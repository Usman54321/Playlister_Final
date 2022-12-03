import { Box, Button, Typography } from "@mui/material";
import AuthContext from "../auth";
import { useContext } from "react";

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    return (
        <div id="splash-screen">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                }}>
                <Typography variant="h1"
                    style={{ color: "black", fontSize: "100px", fontWeight: "bold" }}
                >
                    {'Playlister'}
                </Typography>
                <Typography variant="h4"
                    style={{ marginBottom: "25px", color: "black" }}>
                    {'An easy-to-use tool to manage your songs quickly and efficiently.'}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '65%', gap: 2, }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 2 }}>
                        <Button variant="contained" color="primary" href="/login" sx={{ width: '100%' }}>
                            {'Login'}
                        </Button>
                        <Button variant="contained" color="primary" href="/register" sx={{ width: '100%' }}>
                            {'Register'}
                        </Button>
                    </Box>
                    <Button variant="contained" color="primary" sx={{ width: '100%', cursor: 'pointer' }}
                        onClick={() => {
                            auth.loginAsGuest();
                        }}
                    >
                        {'Continue As Guest'}
                    </Button>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 3 }}
                    >
                        {'Project by Muhammad Usman Rehan, 2022'}
                    </Typography>
                </Box>
            </Box>
        </div >
    );
}