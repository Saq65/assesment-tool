import Button from '@/components/atoms/Button';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useSnackbar from '@/hooks/useSnakbar';
import { ENDPOINTS } from '@/store/endpoints';
import { useDispatch, useSelector } from 'react-redux';
import { authTokenSelector } from '@/store/features/auth/selectors';
import { setLoading } from '@/store/features/alerts';
import { setTemplateId } from '@/store/features/templates';
import { setDeleteId, setEditItem } from '@/store/features/common';


const TemplateActions = ({ params, handleOpenDialogDel, handleOpenUseTemplateDialog, handleOpenEditTemplate }) => {

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


    const handleViewQuestions = async () => {

        const url = `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ADMIN.TEMPLATE.PDF}?id=${params?.id}`;

        try {

            dispatch(setLoading(true))
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/pdf", // Specify the expected content type
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
            }

            // Convert response to Blob
            const blob = await response.blob();

            // Create a URL for the Blob and open it in a new tab
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");

            // Optional: Revoke the Blob URL after some time to free memory
            setTimeout(() => URL.revokeObjectURL(blobUrl), 60000); // Revoke after 1 minute
        } catch (error) {
            showError("Error fetching PDF")
        } finally {
            dispatch(setLoading(false))
        }
    };


    return (
        <div className="flex items-center h-full gap-x-3">
            <Button variant="" size="small" onClick={(e) => {
                handleViewQuestions()
            }}
                style={{
                    backgroundColor: "#343A40", color: "#FFFFFF",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#272C33")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#343A40")}
            >View template</Button>

            <Button
                style={{
                    backgroundColor: "#343A40", color: "#FFFFFF",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#272C33")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#343A40")}
                size="small" onClick={(e) => {
                    e.stopPropagation()
                    handleOpenUseTemplateDialog();
                    dispatch(setTemplateId(params?.id))
                }}>Use template</Button>
            <IconButton
                aria-controls="skill-card-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                size="small"
            >
                <MoreVertIcon style={{ color: "white" }} />
            </IconButton>
            {/* Menu */}
            <Menu
                id="skill-card-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: "#272C33",
                        color: "white",
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' ,
                        borderRadius: "8px",
                        padding: "8px 0",
                        width: "130px"
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        dispatch(setEditItem(params?.row));
                        handleOpenEditTemplate()
                        handleMenuClose();
                    }}
                    sx={{
                        color: "white",
                        fontSize: "1rem",
                        // padding: "10px 16px",
                        '&:hover': {
                            color: "#8C52FF", // Purple hover effect for Edit
                        },
                    }}
                >
                    <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClose()
                        dispatch(setDeleteId(params?.row?.id));
                        handleOpenDialogDel();
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
                    Delete
                </MenuItem>
            </Menu>
        </div>
    )
}

export default TemplateActions