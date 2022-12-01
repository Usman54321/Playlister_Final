import { FormControl, IconButton, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import HomeIcon from '@mui/icons-material/Home';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchBar from "./SearchBar";
import { useContext } from "react";
import { GlobalStoreContext } from "../store";

export default function Navbar() {
    const { store } = useContext(GlobalStoreContext);

    let handleSortChange = (event) => {
        // Change store.sortType to the new value
        store.setSortType(event.target.value);
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
                    href="/"
                >
                    <HomeIcon />
                </IconButton>

                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    href="/community-lists/"
                >
                    <PeopleOutlineIcon />
                </IconButton>

                <IconButton
                    size="large"
                    style={{ textDecration: 'none', color: 'black' }}
                    href="/user-lists/"
                >
                    <PersonOutlineIcon />
                </IconButton>
            </Box>
            <SearchBar />

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
                        <option value="name">Name</option>
                        <option value="likes">Likes</option>
                        <option value="dislikes">Dislikes</option>
                        <option value="listens">Listens</option>
                        <option value="last_edited">Last Edited</option>
                        <option value="published">Published</option>
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}