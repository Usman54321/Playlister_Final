import { FormControl, IconButton, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
// import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchBar from "./SearchBar";
import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom";

export default function Navbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let handleSortChange = (event) => {
        // Change store.sortType to the new value
        store.setSortType(event.target.value);
    }

    let sortOptions = <>
        <option value="name">Name</option>
        <option value="likes">Likes</option>
        <option value="dislikes">Dislikes</option>
        <option value="listens">Listens</option>
    </>

    if (store.currentPage === "HOME") {
        sortOptions = <>
            <option value="name">Name</option>
            <option value="likes">Likes</option>
            <option value="dislikes">Dislikes</option>
            <option value="listens">Listens</option>
            <option value="last_edited">Last Edited</option>
            <option value="published">Published</option>
        </>
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#b1bfca",
                borderRadius: "10px",
                justifyContent: "space-between",
                height: "60px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    marginLeft: "24px",
                }}
            >
                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    onClick={() => {
                        if (store.currentPage !== "HOME") {
                            store.setPage("HOME");
                            // history.push("/");
                        }
                        else {
                            store.closeCurrentList();
                        }
                    }}
                >
                    <HomeOutlinedIcon />
                </IconButton>

                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    onClick={() => {
                        if (store.currentPage !== "COMMUNITY") {
                            store.setPage("COMMUNITY");
                            history.push("/community-lists");
                        }
                    }}
                >
                    <PeopleOutlineIcon />
                </IconButton>

                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    // href="/user-lists/"
                    // disabled={store.currentPage === "USER"}
                    onClick={() => {
                        if (store.currentPage !== "USER") {
                            store.setPage("USER");
                            history.push("/user-lists");
                        }
                    }}
                >
                    <PersonOutlineIcon />
                </IconButton>
            </Box>


            <SearchBar />

            {/* This box is for the Sort By */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: '100%',
                    justifyContent: "flex-end",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h6"
                    color='black'
                />
                {'Sort By: '}
                <FormControl
                    sx={{
                        width: "30%",
                        marginLeft: "10px",
                        marginRight: "10px",
                    }}
                >
                    <Select
                        native
                        onChange={handleSortChange}
                    >
                        {sortOptions}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}