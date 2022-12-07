import GlobalStoreContext from "../store";
import { useContext, useState, useEffect } from "react";
import { List } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import AuthContext from "../auth";

export default function CommentSection(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [comment, setComment] = useState("");
    const displayVal = props.display;
    const [list, setList] = useState(null);

    useEffect(() => {
        if (store.currentPage === "HOME" && store.currentPlayingList) {
            store.getPlaylistById(store.currentPlayingList).then(
                (playlist) => {
                    console.log("Playlist: ", playlist)
                    setList(playlist);
                }
            )
        }
        else if (store.currentPlayingList) {
            store.getPublicPlaylistByID(store.currentPlayingList).then(
                (playlist) => {
                    console.log("Playlist: ", playlist)
                    setList(playlist);
                }
            )
        }
    }, [store.currentPlayingList, store.idNamePairs, store.currentPage]);


    let comments = [];
    if (list && list.comments) {
        comments = list.comments;
    }
    let cardColor = "#e3f2fd";
    let commentList = comments.map((comment, index) => {
        return (
            <ListItem
                key={index}
                id={"comment-" + index + "-card"}
                sx={{
                    backgroundColor: cardColor,
                    width: "80%",
                    margin: "10px 0px 10px 0px",
                    padding: "10px 10px 10px 10px",
                    borderRadius: "10px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    {/* Put in the username and comments while making sure they wrap if they are too long */}
                    <Typography
                        variant="body1"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            wordBreak: "break-word",
                            fontSize: "20px",
                            borderBottom: "1px solid #b1bfca",
                        }}
                    >
                        {comment.userName}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            wordBreak: "break-word",
                            fontSize: "16px",
                        }}
                    >
                        {comment.comment}
                    </Typography>
                </Box>
            </ListItem>
        );
    });

    let commentSection = (
        <Box
            sx={{
                // display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "90%",
                justifyContent: "space-between",
                display: displayVal,
            }}
        >
            <List
                sx={{
                    overflowY: "auto",
                }}
            >
                {commentList}
            </List>
            <InputBase
                placeholder="Add a comment"
                inputProps={{ "aria-label": "add a comment" }}
                sx={{
                    width: "80%",
                    margin: "10px 0px 10px 0px",
                    padding: "10px 10px 10px 10px",
                    borderRadius: "10px",
                    backgroundColor: "white"
                }}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        store.addComment(auth.user.userName, comment);
                        setComment("");
                        e.target.value = "";
                    }
                }}
                // Prevent you from typing if you are not logged in
                disabled={!auth.user || !list || list.length === 0}
            />
        </Box >
    );

    return commentSection;
}