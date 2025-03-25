import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchInput = ({ handleSearch, clearSearch }) => {
    const [searchText, setSearchText] = useState("");

    // Handle the search text change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        handleSearch(value); // Call the parent search handler
    };

    // Handle clearing the search input
    const handleClear = () => {
        setSearchText("");
        clearSearch(); // Call the parent clear handler
    };

    return (
        <TextField
            placeholder="Search"
            size="small"
            value={searchText} // Bind the local state value to the input
            onChange={handleSearchChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon style={{ color: "#64748B", marginLeft: 3, marginTop: 2 }} />
                    </InputAdornment>
                ),
                endAdornment: searchText && (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={handleClear}
                            edge="end"
                            style={{ padding: 0 }}
                            size="small"
                        >
                            <ClearIcon style={{ color: "#64748B" }} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                width: "250px",
                backgroundColor: "#272C33",
                borderRadius: "25px",
                "& .MuiOutlinedInput-root": {
                    paddingLeft: "8px",
                    "& fieldset": {
                        borderColor: "transparent !important",
                    },
                    "&:hover fieldset": {
                        borderColor: "transparent !important",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "transparent !important",
                    },
                },
                outline: "none !important",
                "& input": {
                    // color: "#64748B",
                    color: "white",
                    fontSize: "16px",
                    "&::placeholder": {
                        color: "#64748B !important", // New placeholder color
                        opacity: 1
                    },
                },
            }}
        />
    );
};

export default SearchInput;
