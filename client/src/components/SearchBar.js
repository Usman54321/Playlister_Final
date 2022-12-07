import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';

export default function SearchBar() {
    const { store } = useContext(GlobalStoreContext);
    const [searchTerm, setSearchTerm] = useState("");

    // Handler for clicking the search button
    let handleSearch = (event) => {
        // Prevent the page from reloading
        event.preventDefault();
        store.search(searchTerm);
    }



    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'left', width: '100%' }}
        >
            <InputBase
                id="search-input"
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(event) => {
                    setSearchTerm(event.target.value)
                }}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        event.stopPropagation();
                        handleSearch(event);
                    }
                }}
            />
            <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={handleSearch}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}