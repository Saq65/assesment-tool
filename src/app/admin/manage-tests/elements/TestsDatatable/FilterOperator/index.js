import { FormControl, MenuItem, Select } from '@mui/material'
import React from 'react'

const FilterOperator = () => {
    const options = ["Is", "Is not"];

    return (
        <FormControl sx={{ minWidth: 150 }} size="small" fullWidth>
            <Select value={options[0]} disabled disableRipple
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
                }}>
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default FilterOperator