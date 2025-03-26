import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { Menu, MenuItem, IconButton, FormControlLabel } from "@mui/material";
import { Checkbox } from '@mui/material';

const SkillCard = ({ id, title, levels, onEdit, onDelete, selected, showOptions = true, onClick, checkboxSelection }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div
            className={`bg-newCodes-foreground text-white rounded-2xl shadow-lg p-4 gap-2 flex flex-col justify-between min-h-[240px]  max-h-[260px]
            transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl cursor-pointer `}
            onClick={() => onClick(id)}
        >
            <div className="flex justify-between items-center">
                <h2 className="skilltitle text-white text-center text-[18px] font-medium flex-1 break-words">
                    {title}
                </h2>
                {!checkboxSelection && (
                    <>
                        <IconButton
                            aria-controls="skill-card-menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            size="small"
                        >
                            <MoreVertIcon style={{ color: "white" }} />
                        </IconButton>
                    </>

                )}
                {checkboxSelection && (
                    <FormControlLabel
                        control={

                            <Checkbox
                                checked={selected}
                                disableRipple
                                TouchRippleProps={{ style: { color: 'gray' } }}
                                sx={{
                                    color: 'gray',
                                    '&:hover': {
                                        color: 'gray',
                                        // backgroundColor: 'transparent'
                                    },
                                    '&.Mui-checked': {
                                        color: 'gray',
                                    },
                                    '&.Mui-checked:hover': {
                                        color: 'gray',
                                    },
                                    '&.MuiButtonBase-root:hover': {
                                        backgroundColor: 'grau', 
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 24,
                                        color: 'gray', 
                                        '&:hover': {
                                            color: 'yellow', 
                                        }
                                    },
                                } }
                            />
                        }
                    />
                )}
            </div>

            <div className="flex flex-col gap-y-2">
                {levels?.map((level, index) => (
                    <Link
                        href={checkboxSelection ? "" : `/admin/manage-questions?skill=${id}&experience=${level?.levelId}`}
                        key={index}
                        className={`text-white text-sm py-2 text-center rounded-md border border-primary-400 
                        transition-transform duration-200 ${checkboxSelection ? "cursor-default" : "hover:text-blue-400 hover:scale-105"}`}
                        onClick={(e) => {
                            if (checkboxSelection) {
                                e.preventDefault(); // Prevent navigation
                            }
                        }}
                    >
                        <strong>{level.levelName}:</strong> {level.noOfQuestions} questions
                    </Link>
                ))}
            </div>

            {/* Menu */}
            <Menu
                id="skill-card-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: "#0E1626",
                        color: "white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                        borderRadius: "8px",
                        padding: "8px 0",
                        width: "130px"
                    },
                }}
            >
                <MenuItem
                    onClick={() => {
                        onEdit(id);
                        handleMenuClose();
                    }}
                    sx={{
                        color: "white",
                        fontSize: "1rem",
                        '&:hover': {
                            color: "#8C52FF",
                        },
                    }}
                >
                    <EditIcon fontSize="small" style={{ marginRight: 8 }} />
                    Edit
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onDelete(id);
                        handleMenuClose();
                    }}
                    sx={{
                        color: "#EF4444 !important",
                        fontSize: "1rem",
                        '&:hover': {
                            backgroundColor: "rgba(255, 76, 76, 0.1)",
                        },
                    }}
                >
                    <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
};


export default SkillCard;