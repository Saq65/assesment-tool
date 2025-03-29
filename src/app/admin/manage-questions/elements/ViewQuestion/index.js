import React from 'react';
import { Card, CardContent, Typography, Box, Grid, IconButton } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { questionsSelector } from '@/store/features/questions/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { setDeleteId, setEditItem } from '@/store/features/common';
import { CHOICES_MAPPING } from '@/utils';
import { CONSTANTS } from '@/constants';
import TestCases from '../TestCases';

const ViewQuestion = (
    { handleOpenDialogQuestion, handleOpenDialogDel }) => {

    const dispatch = useDispatch()


    const question = useSelector(questionsSelector)



    const handleEdit = () => {
        dispatch(setEditItem(question))
        handleOpenDialogQuestion()
    };

    const handleDelete = () => {
        handleOpenDialogDel()
        dispatch(setDeleteId(question?.id))
    };

    console.log(question?.testCases, "question>>>");


    return (
        <>
            <div className=''>
                <Card style={{ margin: '20px auto', backgroundColor: '#272C33', color: '#FFFFFF', borderRadius: '8px', width: '100%' }}>

                    {/* View for MCQ Question */}
                    {(question?.type == CONSTANTS.QUESTION_TYPES.QUESTION || question?.type == null) && <CardContent>
                        {/* Box containing the Edit and Delete Buttons */}
                        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                Question Details
                            </Typography>
                            <Box>
                                <IconButton
                                    onClick={handleEdit}
                                >
                                    <EditIcon sx={{ color: "#7DD3FC" }} />
                                </IconButton>
                                <IconButton
                                    onClick={handleDelete}
                                    style={{
                                        color: '#E53E3E',
                                        '&:hover': { backgroundColor: '#C53030' }
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* Question Title */}
                        <Typography variant="h6" style={{ marginBottom: '16px', fontWeight: 'bold' }}>
                            <pre className='font-sans whitespace-pre-wrap'>
                                {question?.question}
                            </pre>
                        </Typography>

                        {/* Options */}
                        <Box style={{ marginBottom: '16px' }}>
                            <Grid container spacing={1}>
                                {Object.keys(CHOICES_MAPPING)?.map((choice, index) => {

                                    return (
                                        <Grid item xs={12} key={index}>
                                            <Typography
                                                variant="body1"
                                                style={{
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: choice === question?.answer ? '#1D2126' : 'transparent',
                                                    color: choice === question?.answer ? '#48BB78' : '#FFFFFF',
                                                    whiteSpace: 'pre-wrap',
                                                    border: choice === question?.answer ?'0.2px solid #ffffff':"",
                                                }}
                                            >
                                                {choice}: {question?.choices[index]}
                                            </Typography>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>

                        {/* Correct Answer */}
                        <Typography variant="body2" style={{ marginBottom: '16px', fontWeight: 'bold', color: '#48BB78' }}>
                            Correct Answer: {question?.answer}
                        </Typography>
                        {/* Correct Answer */}
                        <Typography variant="body2" style={{ marginBottom: '16px', fontWeight: 'bold' }}>
                            Duration: {question?.duration} Minutes
                        </Typography>

                    </CardContent>}

                    {/* View for Program Question */}
                    {
                        question?.type == CONSTANTS.QUESTION_TYPES.PROGRAM && <CardContent>
                            {/* Box containing the Edit and Delete Buttons */}
                            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    Question Details
                                </Typography>
                                <Box>
                                    <IconButton
                                        onClick={handleEdit}
                                    >
                                        <EditIcon sx={{ color: "#7DD3FC" }} />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleDelete}
                                        style={{
                                            color: '#E53E3E',
                                            '&:hover': { backgroundColor: '#C53030' }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Question Title */}
                            <Typography variant="h6" style={{ marginBottom: '16px', }}>
                                <pre className='font-sans whitespace-pre-wrap'>{question?.question}</pre>
                            </Typography>

                            <TestCases />


                            {/* Question Duration */}
                            <Typography variant="body2" style={{ marginBottom: '16px', marginTop: "15px", fontWeight: 'bold' }}>
                                Duration: {question?.duration} Minutes
                            </Typography>

                        </CardContent>
                    }
                </Card>
            </div >

        </>
    );
};

export default ViewQuestion;
