import React from 'react';
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back(); // Navigates back to the previous page
    };

    return (
        <IconButton
            onClick={handleBack}
        >
            <ArrowBackIcon sx={{ color: "#ffffff" }} />
            <span className='text-sm ml-2'>Back</span>
        </IconButton>
    );
}

export default BackButton;
