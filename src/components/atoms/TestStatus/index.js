"use client";
import React from 'react';
import { Chip } from '@mui/material';

const TestStatus = ({ status }) => {
    const getChipProps = (status) => {
        switch (status) {
            case 'finished':
                return {
                    label: 'Completed',
                    sx: { backgroundColor: '#16A34A', color: '#FFFFFF',maxWidth: '100px',
                        width: '100%'}, // Custom green color
                };
            case 'pending':
                return {
                    label: 'Pending',
                    sx: { backgroundColor: '#64748B', color: '#FFFFFF',maxWidth: '100px',
                        width: '100%'}, // Custom grey-blue color
                };
            case 'onGoing':
                return {
                    label: 'Ongoing',
                    sx: {
                        backgroundColor: '#0284C7', color: '#FFFFFF', maxWidth: '220px',
                        width: '100%',
                    }, // Custom amber color
                };
            case 'expired':
                return {
                    label: 'Expired',
                    sx: { backgroundColor: '#DC2626', color: '#FFFFFF',maxWidth: '100px',
                        width: '100%', }, // Custom amber color
                };
            case 'disQualified':
                return {
                    label: 'Disqualified',
                    sx: { backgroundColor: '#F97316', color: '#FFFFFF',maxWidth: '100px',
                        width: '100%' }, // Custom amber color
                };
            default:
                return {
                    label: 'Unknown',
                    sx: { backgroundColor: '#D1D5DB', color: '#000000',maxWidth: '100px',
                        width: '100%'}, // Default grey color
                };
        }
    };

    const chipProps = getChipProps(status);

    return <Chip {...chipProps} />;
};

export default TestStatus;
