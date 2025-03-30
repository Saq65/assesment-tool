import Button from '@/components/atoms/Button';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useSnackbar from '@/hooks/useSnakbar';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { authTokenSelector } from '@/store/features/auth/selectors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { setTemplateId } from '@/store/features/templates';
import { setDeleteId, setEditItem } from '@/store/features/common';
import TuneIcon from '@mui/icons-material/Tune';

const DatatableActions = ({ setCheckboxSelection, moduleName, append }) => {

    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);

    const { showError, showSuccess } = useSnackbar()

    const token = useSelector(authTokenSelector)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };



    return (

        <>
            <IconButton
                aria-controls="skill-card-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                size="small"
            >
                <MoreHorizIcon style={{ color: "white", fontSize: '25px' }} />

            </IconButton>
            {/* Menu */}
            <Menu
                id="skill-card-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                disablePortal={true}  
                onClose={handleMenuClose}
                disableAutoFocusItem={true} // Prevents re-rendering during scroll

                PaperProps={{
                    sx: {
                        backgroundColor: "#343A40", // Dark navy background
                        color: "white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                        borderRadius: "8px",
                        padding: "8px 0",
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        setCheckboxSelection(true)
                        handleMenuClose()
                    }}
                    sx={{
                        color: "white",
                        fontSize: "1rem",
                        '&:hover': {
                            color: "#ffffff !important", 
                            backgroundColor: "#343A40 !important", 
                        },
                    }}

                >
                    <CheckCircleOutlineIcon fontSize="small" style={{ marginRight: 8 }} />
                    Select {moduleName + (append || "")}
                </MenuItem>
                {/* <MenuItem
                    onClick={(e) => {

                    }}
                    sx={{
                        color: "#EF4444 !important", // Red color for Delete
                        fontSize: "1rem",
                        // padding: "10px 16px",
                        '&:hover': {
                            backgroundColor: "rgba(255, 76, 76, 0.1)", // Subtle red background on hover
                        },
                    }}
                >
                    <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                    Delete */}
                {/* </MenuItem> */}
            </Menu>
        </>
    )
}

export default DatatableActions