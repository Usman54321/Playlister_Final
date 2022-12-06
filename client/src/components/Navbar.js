import { FormControl, IconButton, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchBar from "./SearchBar";
import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";

export default function Navbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    let handleSortChange = (event) => {
        store.setSortType(event.target.value);
    }

    let sortOptions = <>
        <option value="creationDate">Creation Date (Old-New)</option>
        <option value="lastEditDate">Last Edit Date (New-Old)</option>
        <option value="name">Name (A-Z)</option>
    </>

    let expandedSortOptions = <></>
    if (store.currentPage === "COMMUNITY") {
        expandedSortOptions =
            <>
                <option value="likes">Likes (High - Low)</option>
                <option value="dislikes">Dislikes (High - Low) </option>
                <option value="publishedDate">Published Date (New-Old)</option>
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
                        if (store.currentPage !== "HOME" && auth.user) {
                            store.setPage("HOME");
                            // history.push("/");
                        }
                        else if (!auth.user) {
                            store.setPage("COMMUNITY");
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
                            // history.push("/community-lists");
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
                            // history.push("/user-lists");
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
                        {expandedSortOptions}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}