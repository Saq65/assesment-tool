import React, { useState } from "react";
import { IconButton, Button, ClickAwayListener, FormControl, InputLabel, Select, MenuItem, DialogTitle } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterOperator from "../FilterOperator";
import TimePeriodSelector from "../TimePeriodSelector";
import TestStatusInput from "../TestStatusInput"; // Assuming you have this component
import DeleteIcon from "@mui/icons-material/Delete";
import { getFiltersCount } from "@/utils";
import FilterButton from "../FilterButton";
import JobPositionSelector from "../JobPositionSelector";
import { GridCloseIcon } from "@mui/x-data-grid";

// const selectFilterOptions = ["Status", "Created at"];
const selectFilterOptions = ["Test Status", "Test Date", "Job Position"];

const TestsFilter = ({ filters, setFilters }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false); // Track whether the select dropdown is open

    const handleOpen = () => {
        setIsOpen(true)
        // setFilters([
        //     { id: 1, filterType: "Status", statusInput: [], timePeriodValue: "" } // Default filter with centralized state
        // ])
    };
    const handleClose = () => {
        setIsOpen(false)
        // setFilters([{ id: 1, filterType: "Status", statusInput: [], timePeriodValue: "" }])
    };

    console.log(filters, "filters>>>>>");


    const handleAddFilter = () => {
        if (filters.length < 3) {
            const newId = filters.length + 1;
            setFilters([
                ...filters,
                { id: newId, filterType: "", statusInput: [], jobPositionValue: [], timePeriodValue: "" }
            ]);
        }
    };

    const handleFilterChange = (id, value) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id ? { ...filter, filterType: value } : filter
            )
        );
    };

    const handleDeleteFilter = (id) => {
        setFilters(filters.filter((filter) => filter.id !== id));
    };

    const getAvailableFilterOptions = (id) => {
        const selectedFilters = filters.filter((filter) => filter.id !== id);
        const selectedTypes = selectedFilters.map((filter) => filter.filterType);
        return selectFilterOptions.filter((option) => !selectedTypes.includes(option));
    };

    const handleSelectOpen = () => setIsSelectOpen(true); // Open select dropdown
    const handleSelectClose = () => setIsSelectOpen(false); // Close select dropdown

    const handleStatusInputChange = (id, newStatusInput) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id ? { ...filter, statusInput: newStatusInput } : filter
            )
        );
    };

    const handleTimePeriodChange = (id, newTimePeriodValue) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id ? { ...filter, timePeriodValue: newTimePeriodValue } : filter
            )
        );
    };
    const handleJobPositionChange = (id, newJobPosition) => {
        setFilters(
            filters.map((filter) =>
                filter.id === id ? { ...filter, jobPositionValue: newJobPosition } : filter
            )
        );
    };

    const handleClear = () => {
        setFilters([
            { id: 1, filterType: "Test Status", statusInput: [], timePeriodValue: "", jobPositionValue: [] } // Default filter with centralized state
        ])
    }

    const filtersCount = getFiltersCount(filters)

    return (
        <div className="relative mr-2">
            {/* Filter Icon Button */}
            <FilterButton
                filtersCount={filtersCount}
                handleOpen={handleOpen}
                handleClear={handleClear}
            />

            {/* Custom Popover with ClickAwayListener */}
            {isOpen && (
                <ClickAwayListener
                    onClickAway={(event) => {
                        // Only close the popover if the click is outside the popover, but not if the select dropdown is open
                        if (!isSelectOpen && !event.target.closest('.MuiPopover-root')) {
                            handleClose();
                        }
                    }}
                >
                    <div className="absolute right-0 mt-2 w-[620px] p-4  bg-[#343A40] rounded-2xl shadow-lg z-50">
                        {/* Header */}
                        <header className="flex items-center justify-between pb-4">
                            <h2 className="text-md font-semibold">Filters</h2>
                            <IconButton onClick={() => {
                                setIsOpen(false)
                                setFilters([{ id: 1, filterType: "Test Status", statusInput: [], timePeriodValue: "", jobPositionValue: [] }])
                            }} style={{ color: '#fff', paddingInline: "10px" }} size="small">
                                    <GridCloseIcon />
                            </IconButton>

                        </header>

                        {/* Body */}
                        <div className="space-y-4">
                            {/* Filter Group */}
                            {filters.map((filter) => (
                                <div key={filter.id} className="flex gap-x-3 w-full">
                                    {/* Select Filter */}
                                    <div className="flex-[0.7]">
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select Filter</InputLabel>
                                            <Select
                                                value={filter.filterType}
                                                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                                                label="Select Filter"
                                                onOpen={handleSelectOpen}
                                                onClose={handleSelectClose}
                                                MenuProps={{
                                                    PaperProps: {},
                                                    disableScrollLock: true,
                                                }}
                                                disableRipple
                                                autoFocus={false}
                                                sx={{
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'gray',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'gray !important',
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'gray !important',
                                                    },
                                                    '& .MuiSelect-select:focus': {
                                                        backgroundColor: 'transparent',
                                                    },
                                                }}
                                            >
                                                {getAvailableFilterOptions(filter.id).map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    {/* Filter Operator */}
                                    <div className="flex-[0.5]">
                                        <FilterOperator />
                                    </div>

                                    {/* Date Picker */}
                                    <div className="flex-1 ">
                                        {filter.filterType === "Test Status" ? (
                                            <TestStatusInput
                                                statusInput={filter.statusInput}
                                                setStatusInput={(newStatusInput) =>
                                                    handleStatusInputChange(filter.id, newStatusInput)
                                                }
                                            />
                                        ) : filter.filterType === "Test Date" ? (
                                            <TimePeriodSelector
                                                timePeriodValue={filter.timePeriodValue}
                                                setTimePeriodValue={(newTimePeriodValue) =>
                                                    handleTimePeriodChange(filter.id, newTimePeriodValue)
                                                }
                                            />
                                        ) : filter.filterType === "Job Position" ? (
                                            <JobPositionSelector
                                                jobPositionValue={filter.jobPositionValue}
                                                setJobPositionValue={(newJobPosition) => {
                                                    console.log(newJobPosition, "new job>>>");

                                                    handleJobPositionChange(filter.id, newJobPosition)
                                                }

                                                }
                                            />
                                        ) : null}
                                    </div>

                                    <div className="flex items-center">
                                        <IconButton
                                            onClick={() => handleDeleteFilter(filter.id)}
                                            style={{ color: '#E53E3E' }}
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            ))}

                            {/* Add Filter Button */}
                            {(filters.length < 3) && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleAddFilter}
                                    disabled={filters.length >= 3}
                                    sx={{
                                        backgroundColor: "#343A40",
                                        color: "#FFFFFF",
                                        borderColor: "#FFFFFF", // Ensures the border is white
                                        "&:hover": {
                                            backgroundColor: "#343A40", // Prevents background color change on hover
                                            borderColor: "gray", // Ensures border remains the same
                                        },
                                        "&.Mui-focusVisible": {
                                            outline: "none !important", // Removes the blue outline when focused
                                        },
                                        "&:focus": {
                                            outline: "none !important",
                                            borderColor: "#FFFFFF", // Ensures border does not change on focus
                                        },
                                        "&:active": {
                                            backgroundColor: "#343A40", // Ensures no color change when clicking
                                            borderColor: "#FFFFFF",
                                        },
                                    }}
                                >
                                    + Add Filter
                                </Button>

                            )}
                        </div>
                    </div>
                </ClickAwayListener>
            )}
        </div>
    );
};

export default TestsFilter;
