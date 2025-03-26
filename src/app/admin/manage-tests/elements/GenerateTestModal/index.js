'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, Checkbox, RadioGroup, Radio, FormControlLabel, Grid, FormControl, FormHelperText, DialogTitle, IconButton } from '@mui/material';
import { useFormik } from 'formik';
import CustomInput from '@/components/atoms/TextInput';
import { experienceLevelsSelector, skillsSelector } from '@/store/features/questions/selectors';
import { useSelector } from 'react-redux';
import * as Yup from "yup"; // Yup validation
import Button from '@/components/atoms/Button';
import { getSkillId, getSkillName } from '@/utils';
import { generateTestValidationSchema } from '@/validations/generate-test-schema';
import { GridCloseIcon } from '@mui/x-data-grid';


const GenerateTestModal = ({ openDialog, handleCloseDialog, handleGenerateTest }) => {

    const experienceLevels = useSelector(experienceLevelsSelector)
    const skillsList = useSelector(skillsSelector);

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedProgramSkills, setSelectedProgramSkills] = useState([]);



    const formik = useFormik({
        initialValues: {
            candidateName: '',
            candidateEmail: '',
            totalDuration: '',
            candidateJobPosition: '',
            skills: {},
            programCount: "",
            programSkillLevelPairs: []
        },
        validationSchema: () => generateTestValidationSchema(formik?.values?.programSkillLevelPairs),
        onSubmit: (values) => {
            const payload = {
                ...values,
                skillLevelPairs: selectedSkills,
                totalDuration: +values?.totalDuration
            };
            delete payload?.skills
            handleGenerateTest(payload)
        },
    });

    useEffect(() => {
        if (formik?.values?.programSkillLevelPairs?.length == 0) {
            formik.setFieldTouched("programSkillLevelPairs", false)
            formik.setFieldError("programSkillLevelPairs", "")
        }
    }, [formik?.values?.programSkillLevelPairs])

    // Handle skill checkbox toggle for Skills
    const handleCheckboxChangeSkills = (event) => {
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


    // Handle skill level change for Skills
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
        if (!openDialog) {
            formik?.resetForm();
            setSelectedSkills([])
        }
    }, [openDialog])


    return (
        <Dialog open={openDialog} onClose={handleCloseDialog}
            sx={{
                '& .MuiDialog-paper': { backgroundColor: '#272C33', minWidth: '400px', overflow: "hidden" }, '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                }
            }} >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className='text-[18px] font-bold'>Generate Test</h3>
                <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className='max-h-[calc(100vh-240px)] px-6 overflow-y-auto'
                >
                    <Grid container spacing={2}>
                        {/* Candidate's Name */}
                        <Grid item xs={12}>
                            <CustomInput
                                name="candidateName"
                                label="Name of Candidate"
                                value={formik.values.candidateName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.candidateName}
                                helperText={formik.errors.candidateName}
                                touched={formik.touched.candidateName}
                                required={true}
                            />
                        </Grid>

                        {/* Candidate's Email */}
                        <Grid item xs={12}>
                            <CustomInput
                                name="candidateEmail"
                                label="Email"
                                value={formik.values.candidateEmail}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.candidateEmail}
                                helperText={formik.errors.candidateEmail}
                                touched={formik.touched.candidateEmail}
                                required={true}
                            />
                        </Grid>

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

                        {/* Test Duration */}
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
                            <fieldset onBlur={() => formik.setFieldTouched("skills")} className='border max-h-[260px] p-4 overflow-y-auto rounded-lg ' style={{
                                borderColor: formik?.errors?.skills && formik?.touched?.skills ? "#FF1943" : "#ffffff3b"
                            }}>
                                <legend style={{ color: formik?.errors?.skills && formik?.touched?.skills ? "#FF1943" : "#ffffff" }} className=' !text-[#FFFFFFB3] !text-[12px]'>Choose Skills for MCQ's *</legend>

                                {skillsList.map((skill) => (
                                    <div key={getSkillName(skill.name)} className="flex flex-col justify-between">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={getSkillName(skill.name)}
                                                    checked={selectedSkills?.find((item) => item?.id == getSkillId(skill))}
                                                    onChange={handleCheckboxChangeSkills}
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
                                                            backgroundColor: 'grau',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 24,
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'yellow',
                                                            }
                                                        },
                                                    }} value={getSkillId(skill)}
                                                />
                                            }
                                            label={getSkillName(skill)}
                                        />
                                        {/* {selectedSkills?.find((item) => item?.skillId == getSkillId(skill?.id)) && ( */}
                                        {selectedSkills?.find((item) => item?.skillId == getSkillId(skill)) && (
                                            <FormControl component="fieldset" sx={{ marginInline: 3 }}>
                                                <span className="text-xs">Select Skill Level</span>
                                                <RadioGroup
                                                    name={skill.skillId}
                                                    value={selectedSkills?.find((item) => item?.skillId == getSkillId(skill))?.levelId}
                                                    row
                                                >
                                                    {experienceLevels?.map((exp) => (
                                                        <FormControlLabel
                                                            key={exp.id}
                                                            value={exp.id}
                                                            control={<Radio />}
                                                            label={exp.title}
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
                                                                    backgroundColor: 'grau',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    fontSize: 24,
                                                                    color: 'gray',
                                                                    '&:hover': {
                                                                        color: 'yellow',
                                                                    }
                                                                },
                                                            }} onChange={(event) => handleSkillChange(event?.target?.value, getSkillId(skill))}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        )}
                                    </div>
                                ))}



                            </fieldset>
                            {formik?.touched?.skills && <FormHelperText className='!text-[#FF1943]'>{formik?.errors?.skills}</FormHelperText>}
                        </Grid>

                        {/*  Program Skills Selection Section */}
                        <Grid item xs={12}>
                            <fieldset onBlur={() => formik.setFieldTouched("programSkillLevelPairs")} className='border max-h-[260px] p-4 overflow-y-auto rounded-lg ' style={{
                                borderColor: formik?.errors?.programSkillLevelPairs && formik?.touched?.programSkillLevelPairs ? "#FF1943" : "#ffffff3b"
                            }}>
                                <legend style={{ color: formik?.errors?.programSkillLevelPairs && formik?.touched?.programSkillLevelPairs ? "#FF1943" : "#ffffff" }} className='text-sm !text-[#FFFFFFB3] !text-[12px]'>Choose Skills for Coding Round</legend>
                                {skillsList.map((skill) => (
                                    <div key={getSkillName(skill.name)} className="flex flex-col justify-between">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name={getSkillName(skill.name)}
                                                    checked={selectedProgramSkills?.find((item) => item?.id == getSkillId(skill))}
                                                    onChange={handleCheckboxChangeProgramSkills}
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
                                                            backgroundColor: 'grau',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 24,
                                                            color: 'gray',
                                                            '&:hover': {
                                                                color: 'yellow',
                                                            }
                                                        },
                                                    }} value={getSkillId(skill)}
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
                                                >
                                                    {experienceLevels?.map((exp) => (
                                                        <FormControlLabel
                                                            key={exp.id}
                                                            value={exp.id}
                                                            control={<Radio />}
                                                            label={exp.title}
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
                                                                    backgroundColor: 'grau',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    fontSize: 24,
                                                                    color: 'gray',
                                                                    '&:hover': {
                                                                        color: 'yellow',
                                                                    }
                                                                },
                                                            }} onChange={(event) => handleSkillChangeProgram(event?.target?.value, getSkillId(skill))}
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
                <div className='sticky bottom-0 z-10 flex justify-end px-6 gap-x-2 py-5'>
                    <Button onClick={handleCloseDialog}
                        style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                        size="small">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="small"
                        style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                    >
                        Generate
                    </Button>
                </div>
            </form>
        </Dialog >
    );
};

export default GenerateTestModal;
