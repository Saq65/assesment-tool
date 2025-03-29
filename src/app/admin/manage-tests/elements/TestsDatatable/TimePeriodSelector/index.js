import { CONSTANTS } from '@/constants';
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

const { TIME_PERIOD_VALUES } = CONSTANTS;

const TimePeriodSelector = ({ timePeriodValue, setTimePeriodValue }) => {
    const options = [
        { label: "Today", value: TIME_PERIOD_VALUES.TODAY },
        { label: "Yesterday", value: TIME_PERIOD_VALUES.YESTERDAY },
        { label: "Last 7 days", value: TIME_PERIOD_VALUES.LAST_7_DAYS },
        { label: "This month", value: TIME_PERIOD_VALUES.THIS_MONTH },
        { label: "Last month", value: TIME_PERIOD_VALUES.LAST_MONTH },
    ];

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option?.label}
            value={timePeriodValue || null}
            onChange={(event, newValue) => {
                setTimePeriodValue(newValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label="Select Values" size="small" />
            )}
            componentsProps={{
                paper: {
                    sx: {
                        backgroundColor: '#272C33', // Background color of dropdown
                        color: 'white', // White text
                    },
                },
                listbox: {
                    sx: {
                        '& .MuiAutocomplete-option': {
                            backgroundColor: '#272C33 !important', // Default background (prevent blue)
                            color: 'white',
                            transition: 'background-color 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: 'gray !important', // Gray on hover
                            },
                            '&[aria-selected="true"]': {
                                backgroundColor: 'gray !important', // Gray when selected
                                color: 'white',
                            },
                        },
                    },
                },
            }}
        />
    );
};

export default TimePeriodSelector;
