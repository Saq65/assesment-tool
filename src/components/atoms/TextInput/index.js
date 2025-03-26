import React, { useEffect, useState } from 'react';
import { FormControl, TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CustomInput = ({
    name,
    label,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    touched,
    inputType = 'text', // Default to 'text'
    multiline = false, // Add multiline prop for textarea functionality
    rows = 4, // Default number of rows for the textarea
    disabled = false,
    shrinkLabel = true,
    required,
    placeholder
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };



    return (
        <FormControl fullWidth sx={{ width: '100%' }} error={touched && Boolean(error)}>
            {/* <TextField
                name={name}
                type={inputType === 'password' && showPassword ? 'text' : inputType} // Toggle between text and password
                label={`${label} ${required ? "*" : ""}`}
                fullWidth
                margin="normal"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={touched && Boolean(error)}
                helperText={touched && helperText}
                disabled={disabled}
                // required={required}
                multiline={multiline} // Enables textarea mode
                rows={multiline ? rows : undefined} // Set the number of rows for textarea
                sx={{
                    '& input:-webkit-autofill': {
                        color:'#fff',
                        WebkitBoxShadow: '0 0 0 1000px #1e293b inset', // Background color for autofill
                        WebkitTextFillColor: 'white', // Text color
                        transition: 'background-color 5000s ease-in-out 0s', // Avoid flickering
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: "whitesmoke", // Lighter border color
                            borderRadius: '30px',
                        },
                    },
                }}
                InputLabelProps={{
                    shrink: shrinkLabel, // Force label to shrink
                }}
                InputProps={{
                    endAdornment: inputType === 'password' && (
                        <InputAdornment position="end" sx={{ marginRight: '8px' }}>
                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                     classes: {
                        input: {
                            '&::placeholder': {
                                color: '#B0B3B8', // Lighter placeholder color
                            },
                        },
                    },
                }}
                placeholder={placeholder}
            /> */}

            <TextField
                name={name}
                type={inputType === 'password' && showPassword ? 'text' : inputType} // Toggle between text and password
                label={`${label} ${required ? "*" : ""}`}
                fullWidth
                margin="normal"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                error={touched && Boolean(error)}
                helperText={touched && helperText}
                disabled={disabled}
                multiline={multiline} // Enables textarea mode
                rows={multiline ? rows : undefined} // Set the number of rows for textarea
                sx={{
                    '& input': {
                        color: '#fff', // Default text color
                    },
                    '&:hover input': {
                        color: 'gray', // Change text color on hover
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: "whitesmoke", // Default border color
                            borderRadius: '30px',
                        },
                        '&:hover fieldset': {
                            borderColor: 'gray', // Change border color on hover
                        },
                    },
                }}
                InputLabelProps={{
                    shrink: shrinkLabel, // Force label to shrink
                }}
                InputProps={{
                    endAdornment: inputType === 'password' && (
                        <InputAdornment position="end" sx={{ marginRight: '8px' }}>
                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                placeholder={placeholder}
            />

        </FormControl>
    );
};

export default CustomInput;
