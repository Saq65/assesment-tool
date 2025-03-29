"use client"
import React from 'react'
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { alertsSelector } from '@/store/features/alerts/selectors';

const Loader = () => {

    const { loading } = useSelector(alertsSelector)

    return (
        <Box
            sx={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', zIndex: 9999, display: loading ? "flex" : "none", background: "rgba(0,0,0,0.5)" }}
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress size={64} disableShrink thickness={3} sx={{ color: "gray !important" }} />
        </Box>
    )
}

export default Loader