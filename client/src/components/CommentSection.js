import GlobalStoreContext from "../store";
import { useContext, useState } from "react";
import { List } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import AuthContext from "../auth";

export default function CommentSection() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [comment, setComment] = useState("");


    let list = [];
    if (store && store.currentList) {
        list = store.currentList;
    }
    let comments = [];
    if (list.comments) {
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
                        width: "80%",
                    }}
                >
                    {/* Put in the username and comments while making sure they wrap if they are too long */}
                    <Typography
                        variant="body1"
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "80%",
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
                            width: "80%",
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
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "90%",
                justifyContent: "space-between",
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
            />
        </Box >
    );

    return commentSection;
}