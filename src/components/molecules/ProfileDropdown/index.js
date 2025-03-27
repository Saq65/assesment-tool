import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import { deleteCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { setAuthToken } from "@/store/features/auth";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";


const ProfileDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);

    const dispatch = useDispatch();

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        dispatch(setAuthToken(""));
        deleteCookie("authToken");
        handleClose();
        window.location.href = "/admin/login"
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Avatar */}
            <button onClick={handleClick} className="flex items-center gap-x-[10px]">
                <Avatar
                    alt="User Avatar"
                    sx={{
                        cursor: "pointer",
                        width: 45,
                        height: 45,
                        background: "#343A40",
                        color: "#D1D5DB",
                    }}
                >A</Avatar>

                {/* Username */}
                <Typography
                    variant="body1"
                    sx={{
                        color: "#D1D5DB",
                        fontWeight: 500,
                        fontSize: "16px",
                    }}
                >
                    Admin
                </Typography>

                {/* Dropdown Button */}
                <IconButton

                    sx={{
                        // background: "white",
                        // color: "#334155",
                        "&:hover": { background: "transparent" },
                    }}
                >
                    <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${isOpen ? "rotate-180" : ""} transition-all duration-300`}
                    >
                        <g id="Arrows / down arrow (right)">
                            <g clipPath="url(#clip0_980_1079)">
                                <rect width={24} height={24} rx={12} fill="#343A40" />
                                <path
                                    id="Vector"
                                    d="M8.70956 11.71L11.2996 14.3C11.6896 14.69 12.3196 14.69 12.7096 14.3L15.2996 11.71C15.9296 11.08 15.4796 10 14.5896 10H9.40956C8.51956 10 8.07956 11.08 8.70956 11.71Z"
                                    fill="white"
                                />
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_980_1079">
                                <rect width={24} height={24} rx={12} fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                </IconButton>
            </button>
            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                className="mt-2"
                PaperProps={{
                    sx: {
                        backgroundColor: "#343A40", 
                        color: "white",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                        borderRadius: "8px",
                        padding: "2px",
                    },
                }}

            >
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(125, 211, 252, 0.1) !important",
                        },
                        background: "#343A40",
                        minWidth: "auto", // Prevents MUI from setting a wide default width
                        padding: "4px 10px", // Adjust padding to make it smaller
                        maxWidth: "120px", // You can further tweak this
                    }}
                >
                    <ListItemIcon sx={{ minWidth: "30px" }}> {/* Adjust icon size */}
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <span className="text-white text-sm">Logout</span>
                </MenuItem>

            </Menu>
        </div>
    );
};

export default ProfileDropdown;
