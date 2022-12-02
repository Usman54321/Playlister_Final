import { Box } from "@mui/material";
import React from 'react';
import YouTube from 'react-youtube';

export default function Player() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <YouTube
                videoId="dQw4w9WgXcQ"
                opts={{
                    width: '80%',
                }}
            />
        </Box>
    );
}