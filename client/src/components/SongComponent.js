import GlobalStoreContext from "../store"
import { Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";

export default function SongComponent(props) {
    const { store } = useContext(GlobalStoreContext);
    const list_id = props.listId;
    const [currentList, setList] = useState(store.currentList);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            store.getSongsByPlaylistId(list_id).then((data) => {
                setList(data);
                setLoading(false);
            });
        }
    }, [isLoading]);


    if (isLoading) {
        return (
            <div>
                <Typography variant="h5">
                    {'Loading Songs...'}
                </Typography>
            </div>
        );
    }
    else {
        if (currentList.length === 0) {
            return (
                // <Typography variant="h5">
                //     {'No Songs in Playlist'}
                // </Typography>
                <br>
                </br>
            );
        }
        return (
            <List>
                {/* Map currentList songs with the following format:
                    1. Song Name by Artist Name
                    2. Song Name by Artist Name
                */}
                {currentList.map((song, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            backgroundColor: "#b1bfca",
                            borderRadius: "10px",
                            mb: "10px",
                        }}
                    >
                        {index + 1}. {song.title} by {song.artist}
                    </ListItem>
                ))}
            </List>
        );
    }
}