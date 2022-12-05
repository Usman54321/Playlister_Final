import { Box } from "@mui/material";
import YouTube from 'react-youtube';

export default function Player(props) {
    let ytid = props.ytid;
    if (!ytid) {
        // id = 'dQw4w9WgXcQ'
        return (
            // Empty box with same dimensions as YouTube player
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    height: "360px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
            </Box>
        );
    }
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <YouTube
                videoId={ytid}
                opts={{
                    width: '80%',
                }}
            />
        </Box>
    );
}