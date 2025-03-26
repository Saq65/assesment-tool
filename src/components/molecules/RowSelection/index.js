import React from 'react';
import { IconButton } from '@mui/material';
import { Delete, Cancel as CancelIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setDeleteId } from '@/store/features/common';



const RowSelection = ({ checkboxSelection, setCheckboxSelection, rowSelectionModel, handleRemoveCheckboxSelection, handleOpenDialog }) => {

    const dispatch = useDispatch()

    return (
        <div
            className={`flex items-center px-5 py-3 justify-between mb-3 bg-newCodes-foreground rounded-lg transition-all duration-300 ease-in-out ${checkboxSelection
                ? 'opacity-100 h-[64px] visibility-visible ' // When checkbox is selected
                : 'opacity-0 h-0 visibility-hidden overflow-hidden !p-0' // When not selected
                }`}
        >
            <div className="text-white">
                {rowSelectionModel?.length} records selected
            </div>
            <div>
                {rowSelectionModel?.length > 0 && <IconButton
                    style={{
                        color: '#E53E3E',
                        '&:hover': { backgroundColor: '#C53030' },
                    }}
                    onClick={() => {
                        handleOpenDialog()
                        dispatch(setDeleteId(rowSelectionModel))
                    }}
                >
                    <Delete style={{ cursor: 'pointer', color: '#EF4444' }} />
                </IconButton>}
                <IconButton
                    onClick={() => {
                        handleRemoveCheckboxSelection()
                    }}
                // aria-label="Delete User"
                >
                    <CancelIcon sx={{ color: 'white' }} />
                </IconButton>
            </div>
        </div>

    )
}

export default React.memo(RowSelection)