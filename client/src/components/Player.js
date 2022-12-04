import { Box } from "@mui/material";
import React from 'react';
import YouTube from 'react-youtube';

export default function Player(props) {
    let id = props.id;
    if (!id)
        id = 'dQw4w9WgXcQ'
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <YouTube
                videoId={id}
                opts={{
                    width: '80%',
                }}
            />
        </Box>
    );
}