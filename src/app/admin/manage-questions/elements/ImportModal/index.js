'use client';

import React, { useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomInput from '@/components/atoms/TextInput';
import CustomSelect from '@/components/atoms/CustomSelect';
import { useSelector } from 'react-redux';
import { experienceLevelsSelector, skillsSelector } from '@/store/features/questions/selectors';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { GridCloseIcon } from '@mui/x-data-grid';



const ImportModal = ({ openDialog, handleCloseDialog, handleImport }) => {


    const searchParams = useSearchParams();
    const skillParam = searchParams.get('skill');
    const experienceParam = searchParams.get('experience');

    const skills = useSelector(skillsSelector);
    const experienceLevels = useSelector(experienceLevelsSelector);


    // Form validation schema with Yup
    const validationSchema = Yup.object({
        skillId: Yup.string().required('Skill is required'),
        levelId: Yup.string().required('Experience level is required'),
        file: Yup.mixed().required('File is required').test('fileType', 'Only Excel files are allowed', (value) => {
            return value && value.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }),
    });

    // useFormik hook to manage form state and validation
    const formik = useFormik({
        initialValues: {
            skillId: skillParam,
            levelId: experienceParam,
            file: null,
        },
        validationSchema,
        onSubmit: (values) => {
            handleImport(values); // handle import action
        },
    });

    useEffect(() => {
        if (openDialog) {
            formik.setValues({
                skillId: skillParam,
                levelId: experienceParam,
                file: null,
            })
        } else {
            formik?.resetForm()
            // formik.setValues({
            //     skillId: "",
            //     levelId: "",
            //     file: null,
            // })
        }
    }, [openDialog])



    return (
        <Dialog open={openDialog} onClose={handleCloseDialog}
            sx={{ '& .MuiDialog-paper': { backgroundColor: '#1D2126', width: '400px' } }}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(5px)",
                },
            }}
        >

            <DialogTitle className="text-white text-center font-semibold text-xl">
                Import Questions
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "white",
                    }}
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent sx={{ paddingTop: '10px !important' }}>

                    {/* Select Skill */}
                    <CustomSelect
                        name="skillId"
                        label="Skill"
                        value={formik.values.skillId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.experienceLevel}
                        helperText={formik.errors.experienceLevel}
                        touched={formik.touched.experienceLevel}
                        options={skills} // Example options for experience level
                    />
                    {/* Select Experience Level */}
                    <CustomSelect
                        name="levelId"
                        label="Experience Level"
                        value={formik.values.levelId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.errors.experienceLevel}
                        helperText={formik.errors.experienceLevel}
                        touched={formik.touched.experienceLevel}
                        options={experienceLevels} // Example options for experience level
                    />


                    {/* File Upload */}
                    <CustomInput
                        name="file"
                        // label="Choose file"
                        onChange={(event) => formik.setFieldValue('file', event.currentTarget.files[0])}
                        onBlur={formik.handleBlur}
                        error={formik.errors.file}
                        helperText={formik.errors.file}
                        touched={formik.touched.file}
                        inputType="file" // Use the 'file' input type
                    />
                    <a className='text-blue-500 text-sm underline cursor-pointer' href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/test/question/template`}>Download Sample File</a>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="secondary"
                        size="small"
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                        style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="small"
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                        style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                    >
                        Import
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ImportModal;
