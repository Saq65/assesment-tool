import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const CustomPagination = ({ handlePageChange, pagination }) => {




    return (
        <Stack spacing={2} sx={{ alignItems: 'center', marginTop: 3 }}>
            <Pagination

                count={pagination?.totalPages} // Total number of pages
                page={+pagination?.currentPage} // Current selected page
                onChange={(e, value) => {
                    handlePageChange(value)
                }} // Handle page change
                // color="primary" // You can change this to "secondary" or any color
                shape="rounded" // Optional: Adds rounded corners to the pagination
                // variant="outlined" // Optional: You can change the variant to "text"
                sx={{
                    '.MuiPaginationItem-root:hover': {
                        backgroundColor: '#343A40', // Hover color
                    },
                }}
            />
        </Stack>
    );
};

export default CustomPagination;
