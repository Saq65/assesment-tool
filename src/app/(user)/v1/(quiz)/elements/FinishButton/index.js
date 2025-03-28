import React from 'react'
import FinishTestDialog from '../FinishTestDialog'
import useDialog from '@/hooks/useDialog';
import { userAuthSelector } from '@/store/features/userAuth/selectors';
import { socketSelector } from '@/store/features/socket/selectors';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import { finishTest } from '@/store/features/test';

const FinishButton = ({ sx = {} }) => {

    const dispatch = useDispatch()
    const { openDialog, handleCloseDialog, handleOpenDialog } = useDialog();

    const userAuth = useSelector(userAuthSelector);
    const socket = useSelector(socketSelector)

    return (
        <>
            <Button
                size="small"
                variant="contained"
                sx={{
                    borderColor: '#7DD3FC', 
                    color: '#fff', 
                    background: "#343A40",
                    '&:hover': {
                        backgroundColor: 'gray', 
                        color: '#ffffff', 
                    },
                    ...sx,
                }}
                onClick={() => {
                    handleOpenDialog()
                    dispatch(finishTest({ socket }))
                }}
            >
                Finish Test
            </Button>
            <FinishTestDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} handleOpenDialog={handleOpenDialog} /></>
    )
}

export default FinishButton