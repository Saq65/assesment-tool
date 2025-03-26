'use client';

import React, { useEffect, useRef } from 'react';
import { Dialog, IconButton, FormHelperText, Fab, DialogTitle } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Yup validation
import CustomInput from '@/components/atoms/TextInput';
import Button from '@/components/atoms/Button';
import AddIcon from '@mui/icons-material/Add';
import CustomSelect from '@/components/atoms/CustomSelect';
import { useSelector } from 'react-redux';
import { allTemplatesSelector, templateIdSelector } from '@/store/features/templates/selectors';
import CancelIcon from '@mui/icons-material/Cancel';
import { GridCloseIcon } from '@mui/x-data-grid';
const UseTemplateModal = ({ openDialog, handleCloseDialog, handleGenerateTest }) => {

    const allTemplates = useSelector(allTemplatesSelector);
    const templateId = useSelector(templateIdSelector)


    const scrollableContentRef = useRef()

    const validationSchema = Yup.object({
        templateId: Yup.string().required('Template is required'),
        users: Yup.array().of(
            Yup.object({
                name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters long'),
                email: Yup.string()
                    .required('Email is required')
                    .email('Invalid email address')
                    .test('unique-email', 'Email must be unique', function (value) {
                        const { users } = this.options.context; // Access the form values from context

                        // Ensure email is unique by filtering users and comparing the current value
                        const emailCount = users.filter(user => user.email === value).length;
                        return emailCount === 1; // Ensure the email is unique
                    }),
            })
        ).min(1, 'At least one user must be added'),
    });

    const formik = useFormik({
        initialValues: {
            templateId: templateId,
            users: [{ name: '', email: '' }],
        },
        validationSchema,
        onSubmit: (values) => {
            handleGenerateTest(values);
        },
    });

    // useEffect(() => {
    //     formik.setFieldValue("templateId", templateId)
    // }, [templateId])

    // Add a new user
    const addUser = () => {
        formik.setFieldValue('users', [...formik.values.users, { name: '', email: '' }]);
        // Ensure that the scrollable content is scrolled to the bottom
        setTimeout(() => {
            if (scrollableContentRef.current) {
                // Scroll to the bottom with smooth behavior
                scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight;
            }
        }, 200);
    };
    const removeUser = (index) => {
        // Remove the user from formik values
        const updatedUsers = formik.values.users.filter((_, i) => i !== index);
        formik.setFieldValue('users', updatedUsers);

        // Remove the corresponding errors and touched states for the removed user
        const updatedErrors = { ...formik.errors };
        const updatedTouched = { ...formik.touched };

        // Remove the user's error and touched from the respective objects
        delete updatedErrors.users?.[index];
        delete updatedTouched.users?.[index];

        // Update formik errors and touched state
        formik.setErrors(updatedErrors);
        formik.setTouched(updatedTouched);
    };


    useEffect(() => {
        if (!openDialog) {
            formik.resetForm();
        } else {
            formik.setFieldValue("templateId", templateId)
        }
    }, [openDialog, templateId]);

    useEffect(() => {
        if (!openDialog) {
            formik.resetForm();
        }

        // Disable background scroll when modal is open
        if (openDialog) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // Also target the html element
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = ''; // Reset the html overflow
        }

        // Clean up the scroll disabling effect on unmount
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = ''; // Reset the html overflow when unmounted
        };
    }, [openDialog]);


    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: '#272C33',
                    height: "100%",
                    minWidth: '800px',
                    maxWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow:'hidden'
                },
                 '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="text-[18px] leading-6 px-6 font-bold my-6">Generate tests from saved templates</h3>
                <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            {/* Title */}

            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col h-full"
            >
                {/* Scrollable Content */}
                <div
                    ref={scrollableContentRef}
                    className="px-6 overflow-y-auto flex-1 max-h-[calc(100vh-220px)] scroll-smooth"
                >
                    {/* Template Select */}
                    <div className="mb-4">
                        <CustomSelect
                            name="templateId"
                            label="Template"
                            options={allTemplates?.map((template) => ({
                                id: template?.id,
                                title: template?.candidateJobPosition
                            }))}
                            value={formik.values.templateId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            touched={formik.touched?.templateId}
                            error={formik.errors?.templateId}
                            helperText={formik.touched.templateId && formik.errors.templateId}
                            disabled={true}
                        />
                    </div>

                    {/* Users Section */}
                    <div>
                        <h4 className="text-sm font-bold mb-4">Add Candidates</h4>
                        {formik.values.users.map((user, index) => (
                            <div className='flex items-start'>

                                <div
                                    key={index}
                                    className=" flex flex-1 justify-between items-center w-full"
                                >
                                    <span className=' mr-2 '>{index + 1}.</span>
                                    {/* Name Field */}
                                    <div className="flex-1 pr-2">
                                        <CustomInput
                                            name={`users[${index}].name`}
                                            label="Name"
                                            value={user.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            touched={formik.touched.users?.[index]?.name}
                                            error={formik.errors.users?.[index]?.name}
                                            helperText={
                                                formik.touched.users?.[index]?.name &&
                                                formik.errors.users?.[index]?.name
                                            }
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="flex-1 pr-2">
                                        <CustomInput
                                            name={`users[${index}].email`}
                                            label="Email"
                                            value={user.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            touched={formik.touched.users?.[index]?.email}
                                            error={formik.errors.users?.[index]?.email}
                                            helperText={
                                                formik.touched.users?.[index]?.email &&
                                                formik.errors.users?.[index]?.email
                                            }
                                        />
                                    </div>

                                    {/* Delete Button */}
                                    {formik.values.users.length > 1 && (
                                        <div className="flex justify-center items-center">
                                            <IconButton
                                                onClick={() => removeUser(index)}
                                                aria-label="Delete User"
                                            >
                                                <CancelIcon sx={{ color: '#EF4444' }} />

                                            </IconButton>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {formik.touched.users && typeof formik.errors.users === 'string' && (
                            <FormHelperText className="!text-[#FF1943]">{formik.errors.users}</FormHelperText>
                        )}
                        <div className="flex justify-center mt-3">
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={addUser}
                                sx={{
                                    position: "relative",
                                    right: 0,
                                    zIndex: 10,
                                    color: "black",
                                    background: "#7DD3FC",
                                    "&:hover": {
                                        background: "#7DD3FC", // Same as the background color to disable hover color change
                                    },
                                }}
                                size='small'
                            >
                                <AddIcon />
                            </Fab>
                        </div>
                    </div>
                </div>

                {/* Buttons - Fixed at Bottom */}
                {/* <DialogActions> */}
                <div
                    className="sticky bottom-0 bg-[#272C33] z-10 flex justify-end px-6 gap-x-2 py-5"
                >
                    {/* <div className=' flex justify-end gap-x-2'> */}
                    <Button onClick={handleCloseDialog} variant="secondary" size="small"
                        style={{ backgroundColor: "#343A40", color: "#FFFFFF" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" size="small"
                        style={{ backgroundColor: "#343A40", color: "#FFFFFF" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    >
                        Send Test
                    </Button>
                    {/* </div> */}
                </div>
                {/* </DialogActions> */}
            </form>
        </Dialog>

    );
};

export default UseTemplateModal;
