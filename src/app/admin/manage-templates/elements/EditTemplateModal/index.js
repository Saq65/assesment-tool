'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, Checkbox, RadioGroup, Radio, FormControlLabel, Grid, FormControl, FormHelperText, DialogTitle, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import CustomInput from '@/components/atoms/TextInput';
import { experienceLevelsSelector, skillsSelector } from '@/store/features/questions/selectors';
import { useSelector } from 'react-redux';
import * as Yup from "yup"; // Yup validation


import Button from '@/components/atoms/Button';
import { compareArrays, compareValues, getSkillId, getSkillName } from '@/utils';
import { editItemSelector } from '@/store/features/common/selectors';
import { editTemplateValidationSchema } from '@/validations/edit-template-schema';
import { GridCloseIcon } from '@mui/x-data-grid';


const EditTemplateModal = ({ openDialog, handleCloseDialog, handleEditTemplate }) => {

    const experienceLevels = useSelector(experienceLevelsSelector)
    const skillsList = useSelector(skillsSelector);

    const editItem = useSelector(editItemSelector);

    const [hasChanged, setHasChanged] = useState(false)


    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedProgramSkills, setSelectedProgramSkills] = useState([]);


    const validationSchema = Yup.object().shape({
        candidateJobPosition: Yup.string()
            .required('Job Position is required')
            .min(3, 'Job Position must be at least 3 characters long')
            .max(30, 'Job Position must not exceed 30 characters'),
        totalDuration: Yup.number()
            .typeError('Please enter a valid number for duration')
            .required('Duration is required')
            .moreThan(0, 'Duration must be greater than 0'),
        skills: Yup.array()
            .of(
                Yup.object().shape({
                    skillId: Yup.string().required('Skill ID is required'),
                    levelId: Yup.string().required('Level ID is required'),
                })
            )
            .min(1, 'At least one skill must be selected'),
    });



    const formik = useFormik({
        initialValues: {
            totalDuration: '',
            candidateJobPosition: '',
            skills: [],
            programCount: "",
            questionRegeneration: false,
            programSkillLevelPairs: []
        },
        validationSchema: () => editTemplateValidationSchema(formik?.values?.programSkillLevelPairs),
        onSubmit: (values) => {
            const payload = {
                ...values,
                programCount: !values?.programCount ? 0 : values?.programCount,
                templateId: editItem?.id,
                questionRegeneration: true,
                skillLevelPairs: selectedSkills,
                totalDuration: +values?.totalDuration,
            };
            delete payload?.skills
            handleEditTemplate(payload)
        },
    });



    // Handle skill checkbox toggle
    const handleCheckboxChange = (event) => {
        const { name, checked, value } = event.target;


        setSelectedSkills((prev) => {
            if (checked) {
                // Add the skill with a default level if checked
                return [...prev, { skillId: value, levelId: experienceLevels?.[0]?.id }];
            } else {

                // Remove the skill if unchecked
                return prev.filter((skill) => skill.skillId !== value);
            }
        });
    };


    // Handle skill level change
    const handleSkillChange = (value, skillId) => {

        setSelectedSkills((prev) =>
            prev.map((skill) =>
                skill.skillId === skillId
                    ? { ...skill, levelId: value } // Update the level for the selected skill
                    : skill
            )
        );
    };



    // Handle program skill checkbox toggle for Program Skills
    const handleCheckboxChangeProgramSkills = (event) => {
        const { name, checked, value } = event.target;


        setSelectedProgramSkills((prev) => {
            if (checked) {
                // Add the skill with a default level if checked
                return [...prev, { skillId: value, levelId: experienceLevels?.[0]?.id }];
            } else {

                // Remove the skill if unchecked
                return prev.filter((skill) => skill.skillId !== value);
            }
        });
    };


    // Handle skill level change for Program Skills
    const handleSkillChangeProgram = (value, skillId) => {

        setSelectedProgramSkills((prev) =>
            prev.map((skill) =>
                skill.skillId === skillId
                    ? { ...skill, levelId: value } // Update the level for the selected skill
                    : skill
            )
        );
    };


    useEffect(() => {
        formik?.setFieldValue("skills", selectedSkills)
    }, [selectedSkills])

    useEffect(() => {
        formik?.setFieldValue("programSkillLevelPairs", selectedProgramSkills)

    }, [selectedProgramSkills])

    useEffect(() => {
        if (formik?.values?.programSkillLevelPairs?.length == 0) {
            formik.setFieldTouched("programSkillLevelPairs", false)
            formik.setFieldError("programSkillLevelPairs", "")
        }
    }, [formik?.values?.programSkillLevelPairs])

    // useEffect(() => {

    //     editItem?.skillLevelPairs && setHasChanged(compareArrays(editItem?.skillLevelPairs, formik?.values?.skills) || compareValues(editItem?.totalDuration, formik?.values?.totalDuration) || compareValues(editItem?.programSkillLevelPairs, formik?.values?.programSkillLevelPairs) || compareValues(editItem?.programCount, formik?.values?.programCount))

    // }, [editItem?.skillLevelPairs, editItem?.programSkillLevelPairs, editItem?.programCount, formik?.values?.skills, formik?.values.programSkillLevelPairs, formik?.values?.totalDuration, formik.programCount]);




    useEffect(() => {
        if (editItem?.skillLevelPairs) {
            setSelectedSkills(editItem?.skillLevelPairs);
            setSelectedProgramSkills(editItem?.programSkillLevelPairs || [])
            formik?.setValues({
                totalDuration: editItem?.totalDuration,
                candidateJobPosition: editItem?.candidateJobPosition,
                programCount: editItem?.programCount == 0 ? "" : editItem?.programCount,
            })
        }
    }, [editItem, openDialog])


    useEffect(() => {
        if (!openDialog) {
            formik?.resetForm();
            setSelectedSkills([])
        }
    }, [openDialog])

    console.log(selectedProgramSkills, "selectedProgramSkills>>>");


    return (
        <Dialog open={openDialog} onClose={handleCloseDialog} sx={{
            '& .MuiDialog-paper': { backgroundColor: '#272C33', width: '550px', overflow: "hidden" },
            '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
            }
        }}>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className='text-[18px] leading-6   font-bold '>Edit Template</h3>
                <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className='max-h-[calc(100vh-240px)] px-6 overflow-y-auto'
                //  sx={{ paddinin: '10px !important', flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}
                >
                    <Grid container spacing={2}>


                        {/* Candidate's Role */}
                        <Grid item xs={12}>
                            <CustomInput
                                name="candidateJobPosition"
                                label="Job Position"
                                value={formik.values.candidateJobPosition}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.candidateJobPosition}
                                helperText={formik.errors.candidateJobPosition}
                                touched={formik.touched.candidateJobPosition}
                                required={true}
                            />

                        </Grid>

                        {/* Candidate's Role */}
                        <Grid item xs={12}>
                            <CustomInput
                                name="totalDuration"
                                label="Test Duration (in minutes)"
                                value={formik.values.totalDuration}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only numeric values and disallow leading zeros
                                    if (/^[1-9]\d*$|^$/.test(value)) {
                                        formik.setFieldValue("totalDuration", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.errors.totalDuration}
                                helperText={formik.errors.totalDuration}
                                touched={formik.touched.totalDuration}
                                required={true}
                            />

                        </Grid>

                        {/* Skills Selection Section */}
                        <Grid item xs={12}>
                            <fieldset onBlur={() => formik.setFieldTouched("skills")} className='border max-h-[300px] p-4 overflow-y-auto rounded-lg ' style={{
                                borderColor: formik?.errors?.skills && formik?.touched?.skills ? "#FF1943" : "#ffffff3b",
                                outline: "none !important"
                            }}
                                tabIndex="-1"
                            >
                                <legend style={{ color: formik?.errors?.skills && formik?.touched?.skills ? "#FF1943" : "#ffffff",fontWeight:'500' ,fontSize:'0.7rem'}} className=' '>Choose Skills for MCQ's *</legend>

                                {skillsList?.map((skill) => {

                                    return <div key={getSkillName(skill.name)} className="flex flex-col justify-between">
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={getSkillName(skill.name)}
                                                    checked={selectedSkills?.find((item) => getSkillId(item) == getSkillId(skill))}
                                                    onChange={handleCheckboxChange}
                                                    disableRipple
                                                    disableFocusRipple
                                                    TouchRippleProps={{ style: { color: 'gray' } }}
                                                    autoFocus={false}
                                                    sx={{
                                                        color: "gray",
                                                        "&:hover": {
                                                            color: "gray",
                                                        },
                                                        "&.Mui-checked": {
                                                            color: "gray",
                                                        },
                                                        "&.Mui-checked:hover": {
                                                            color: "gray",
                                                        },
                                                        "&.MuiButtonBase-root:hover": {
                                                            border: "none !important",
                                                        },
                                                        "&.Mui-focusVisible": {  // Remove focus outline
                                                            outline: "none !important",
                                                            boxShadow: "none",
                                                        },
                                                        "&.MuiCheckbox-root:focus": {  // Remove focus outline
                                                            outline: "none !important",
                                                            boxShadow: "none",
                                                        },
                                                        "&.MuiCheckbox-root:focus-visible": {  // Remove focus visible effect
                                                            outline: "none",
                                                            boxShadow: "none",
                                                        },
                                                        "&.MuiButtonBase-root:focus": {  // Remove button focus styles
                                                            outline: "none !important",
                                                            boxShadow: "none",
                                                        },
                                                        "&.MuiButtonBase-root:focus-visible": {
                                                            outline: "none",
                                                            boxShadow: "none",
                                                        },
                                                    }}

                                                    value={getSkillId(skill)}
                                                    defaultChecked={Boolean(selectedSkills?.find((item) => getSkillId(item) == getSkillId(skill)))}
                                                />
                                            }
                                            label={getSkillName(skill)}
                                        /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={getSkillName(skill.name)}
                                                    checked={selectedSkills?.find((item) => getSkillId(item) == getSkillId(skill))}
                                                    onChange={handleCheckboxChange}
                                                    autoFocus={false}
                                                    disableRipple
                                                    TouchRippleProps={{ style: { color: 'gray' } }}
                                                    sx={{
                                                        color: 'gray',
                                                        '&:hover': {
                                                            color: 'gray',
                                                            // backgroundColor: 'transparent'
                                                            outlineColor: 'red'
                                                        },
                                                        '&.Mui-checked': {
                                                            color: 'gray',
                                                        },
                                                        '&.Mui-checked:hover': {
                                                            color: 'gray',
                                                        },
                                                        '&.MuiButtonBase-root:hover': {
                                                            backgroundColor: 'transparent',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 24,
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'yellow',
                                                            }
                                                        },
                                                    }}
                                                    value={getSkillId(skill)}
                                                    defaultChecked={Boolean(selectedSkills?.find((item) => getSkillId(item) == getSkillId(skill)))}
                                                />
                                            }
                                            label={getSkillName(skill)}
                                            sx={{
                                                fontSize: '0.6rem', // Increase label text size
                                                fontWeight: '500', // Make label bold
                                                color: '#ffffff', // White text for better visibility
                                             
                                              }}
                                        />
                                        {/* {selectedSkills?.find((item) => item?.skillId == getSkillId(skill?.id)) && ( */}
                                        {selectedSkills?.find((item) => item?.skillId == getSkillId(skill)) && (
                                            <FormControl component="fieldset" sx={{ marginInline: 3 }}>
                                                <span className="text-xs">Select Skill Level</span>
                                                <RadioGroup
                                                    name={skill.skillId}
                                                    value={selectedSkills?.find((item) => item?.skillId == getSkillId(skill))?.levelId}
                                                    row
                                                    disableRipple
                                                    TouchRippleProps={{ style: { color: 'gray' } }}
                                                    sx={{
                                                        color: 'gray',
                                                        '&:hover': {
                                                            color: 'gray',
                                                            // backgroundColor: 'transparent'
                                                        },
                                                        '&.Mui-checked': {
                                                            color: 'gray',
                                                        },
                                                        '&.Mui-checked:hover': {
                                                            color: 'gray',
                                                        },
                                                        '&.MuiButtonBase-root:hover': {
                                                            backgroundColor: 'gray',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 24,
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: '#fff',
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {experienceLevels?.map((exp) => (
                                                        <FormControlLabel
                                                            key={exp.id}
                                                            value={exp.id}
                                                            control={<Radio />}
                                                            label={exp.title}
                                                            sx={{ color: 'white' }}
                                                            onChange={(event) => handleSkillChange(event?.target?.value, getSkillId(skill))}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        )}
                                    </div>
                                })}



                            </fieldset>
                            {formik?.touched?.skills && <FormHelperText className='!text-[#FF1943]'>{formik?.errors?.skills}</FormHelperText>}
                        </Grid>


                        {/*  Program Skills Selection Section */}
                        <Grid item xs={12}>
                            <fieldset onBlur={() => formik.setFieldTouched("programSkillLevelPairs")} className='border max-h-[260px] p-4 overflow-y-auto rounded-lg ' style={{
                                borderColor: formik?.errors?.programSkillLevelPairs && formik?.touched?.programSkillLevelPairs ? "#FF1943" : "#ffffff3b",

                            }}>
                                <legend style={{ color: formik?.errors?.programSkillLevelPairs && formik?.touched?.programSkillLevelPairs ? "#FF1943" : "#ffffff" }} className='text-sm !text-[#FFFFFFB3] !text-[12px]'>Choose Skills for Coding Round</legend>
                                {skillsList.map((skill, i) => (
                                    <div key={getSkillName(skill.name) + i} className="flex flex-col justify-between">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={getSkillName(skill.name)}
                                                    checked={selectedProgramSkills?.find((item) => getSkillId(item) == getSkillId(skill))}
                                                    onChange={handleCheckboxChangeProgramSkills}
                                                    autoFocus={false}
                                                    disableRipple
                                                    TouchRippleProps={{ style: { color: 'gray' } }}
                                                    sx={{
                                                        color: 'gray',
                                                        '&:hover': {
                                                            color: 'gray',
                                                            // backgroundColor: 'transparent'
                                                            outlineColor: 'red'
                                                        },
                                                        '&.Mui-checked': {
                                                            color: 'gray',
                                                        },
                                                        '&.Mui-checked:hover': {
                                                            color: 'gray',
                                                        },
                                                        '&.MuiButtonBase-root:hover': {
                                                            backgroundColor: 'transparent',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 24,
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'yellow',
                                                            }
                                                        },
                                                    }}
                                                    value={getSkillId(skill)}
                                                />
                                            }
                                            label={getSkillName(skill)}
                                        />
                                        {/* {selectedProgramSkills?.find((item) => item?.skillId == getSkillId(skill?.id)) && ( */}
                                        {selectedProgramSkills?.find((item) => item?.skillId == getSkillId(skill)) && (
                                            <FormControl component="fieldset" sx={{ marginInline: 3 }}>
                                                <span className="text-xs">Select Skill Level</span>
                                                <RadioGroup
                                                    name={skill.skillId}
                                                    value={selectedProgramSkills?.find((item) => item?.skillId == getSkillId(skill))?.levelId}
                                                    row
                                                    disableRipple
                                                    TouchRippleProps={{ style: { color: 'gray' } }}
                                                    sx={{
                                                        color: 'gray',
                                                        '&:hover': {
                                                            color: 'gray',
                                                            backgroundColor: 'transparent'
                                                        },
                                                        '&.Mui-checked': {
                                                            color: 'gray',
                                                        },
                                                        '&.Mui-checked:hover': {
                                                            color: 'gray',
                                                        },
                                                        '&.MuiButtonBase-root:hover': {
                                                            backgroundColor: 'gray',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 24,
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'yellow',
                                                            }
                                                        },
                                                    }}
                                                >
                                                    {experienceLevels?.map((exp) => (
                                                        <FormControlLabel
                                                            key={exp.id}
                                                            value={exp.id}
                                                            control={<Radio />}
                                                            label={exp.title}
                                                            sx={{ color: 'white' }}
                                                            onChange={(event) => handleSkillChangeProgram(event?.target?.value, getSkillId(skill))}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        )}
                                    </div>
                                ))}
                            </fieldset>
                            {formik?.touched?.programSkillLevelPairs && <FormHelperText className='!text-[#FF1943]'>{formik?.errors?.programSkillLevelPairs}</FormHelperText>}
                        </Grid>

                        {/* No of Coding Questions */}
                        <Grid item xs={12}>
                            <CustomInput
                                name="programCount"
                                label="Programming Questions count"
                                value={formik.values.programCount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Allow only numeric values and disallow leading zeros
                                    if (/^[1-9]\d*$|^$/.test(value)) {
                                        formik.setFieldValue("programCount", value);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.errors.programCount}
                                helperText={formik.errors.programCount}
                                touched={formik.touched.programCount}
                            />

                        </Grid>
                    </Grid>
                </div>
                <div className='sticky bottom-0 bg-[#272C33 ] z-10 flex justify-end px-6 gap-x-2 py-5'>
                    <Button onClick={handleCloseDialog} variant='secondary'
                        style={{ backgroundColor: "#343A40", color: "#FFFFFF" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        size="small">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="small"
                        style={{ backgroundColor: "#343A40", color: "#FFFFFF" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    >
                        Generate
                    </Button>
                </div>
            </form>
        </Dialog >
    );
};

export default EditTemplateModal;
