import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ConfirmDelete = ({
    open,
    onClose,
    onDelete,
    message = "Are you sure you want to delete this item?",
    title = "Confirm Deletion",
    cancelButtonText = "Cancel",
    deleteButtonText = "Delete",
}) => {
    const handleConfirm = () => {
        onDelete(); // Execute the delete action
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{
                backdropFilter: "blur(8px)", // Apply blur effect to the background
                WebkitBackdropFilter: "blur(8px)", // Safari support
                "& .MuiDialog-paper": {
                    backgroundColor: "#1D2126", // Custom background color for the dialog box
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{message}</DialogContent>
            <DialogActions>
                <Button onClick={onClose}
                    style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                >
                    {cancelButtonText}
                </Button>
                <Button onClick={handleConfirm} 
                 style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                 onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                 onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                >
                    {deleteButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDelete.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    message: PropTypes.string,
    title: PropTypes.string,
    cancelButtonText: PropTypes.string,
    deleteButtonText: PropTypes.string,
};

export default ConfirmDelete;
