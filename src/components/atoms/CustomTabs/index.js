import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

function a11yProps(index) {
    return {
        id: `custom-tab-${index}`,
        "aria-controls": `custom-tabpanel-${index}`,
    };
}

const CustomTabs = ({ tabs, value, onChange, type }) => {

    if (type == "small") {
        return (
            <Tabs
                value={value}
                onChange={onChange}
                aria-label="custom tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    height: "35px", // Set the height of the outer container
                    minHeight: "35px",
                    paddingLeft: "11px",
                    background:'#343A40',
                    '& .MuiTabs-indicator': {
                        display: 'none', // Removes the underline
                    },
                    '& .MuiTabs-scroller': {
                        height: '35px', // Removes the underline
                    },
                    // Target the left and right scroll buttons (arrows)
                    '& .MuiTabScrollButton-root': {
                        color: '#7ddcfc', // Color for the scroll buttons
                        '& svg': {
                            fill: '#7ddcfc', // Color for the arrow icon inside the scroll buttons
                        },
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        {...a11yProps(index)}
                        sx={{
                            textTransform: "capitalize",
                            fontSize: 12,            // Smaller font size for the tab
                            borderRadius: '10px',    // Makes the tab shape pill-like
                            padding: '4px 12px',     // Reduced padding to make the tab smaller
                            minHeight: '35px',       // Set minimum height for the tab button
                            '&.Mui-selected': {
                                backgroundColor: '#343A40', // Background color for the active tab
                                color: '#fff',          // Text color for the active tab
                            },
                            '&:not(.Mui-selected)': {
                                backgroundColor: 'transparent', // Non-selected tab has no background
                                color: 'white',                  // Non-selected tab text color
                            },
                            transition: 'all 0.3s ease',  // Smooth transition for background color change
                        }}
                    />
                ))}
            </Tabs>
        );
    }


    return (
        <Tabs
            value={value}
            onChange={onChange}
            aria-label="custom tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                '& .MuiTabs-indicator': {
                    display: 'none', 
                },
            }}
        >
            {tabs.map((tab, index) => (
                <Tab
                    key={index}
                    label={tab.label}
                    {...a11yProps(index)}
                    sx={{
                        textTransform: "capitalize",
                        // Default styles for the tabs
                        fontSize: 14,
                        borderRadius: '10px',      // Makes the tab shape pill-like
                        // padding: '2px 8px',        // Reduced padding to make the tab smaller
                        // minHeight: '30px',         // Set minimum height of the tab button to 30px
                        // fontSize: '12px',          // Smaller font size
                        '&.Mui-selected': {
                            backgroundColor: '#343A40', // Background color for the active tab
                            color: '#fff',          // Text color for the active tab
                        },
                        '&:not(.Mui-selected)': {
                            backgroundColor: 'transparent', // Non-selected tab has no background
                            color: 'white',                  // Non-selected tab text color
                        },
                        transition: 'all 0.3s ease',  // Smooth transition for background color change
                    }}
                />
            ))}
        </Tabs>
    );



};

export default CustomTabs;
