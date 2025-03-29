import React, { useEffect, useState } from 'react';
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { CONSTANTS } from '@/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSection } from '@/store/features/test';
import { currentSectionSelector, testSelector } from '@/store/features/test/selectors';

const { TEST_SECTIONS } = CONSTANTS;

const QuestionTypeSwitch = () => {
    const dispatch = useDispatch();
    const test = useSelector(testSelector);
    const currentSection = useSelector(currentSectionSelector);

    const [sections, setSections] = useState([
        { value: TEST_SECTIONS.MCQ, label: `MCQ - ${test.testInfo.questions} Questions`, count: 0 },
        { value: TEST_SECTIONS.PROGRAM, label: `Code - ${test.testInfo.programs} Questions`, count: 0 },
    ])

    useEffect(() => {

        console.log(test.testInfo.question.length, "test.testInfo.questions");

        if (test?.testInfo) {
            const sections = [
                { value: TEST_SECTIONS.MCQ, label: `MCQ - ${test?.testInfo?.question?.length} Questions`, count: test?.testInfo?.question?.length },
                { value: TEST_SECTIONS.PROGRAM, label: `Code - ${test?.testInfo?.programs?.length} Questions`, count: test?.testInfo?.programs?.length },
            ].filter((item) => item.count !== 0)
            setSections(sections)
        }


    }, [test?.testInfo?.programs?.length, test?.testInfo?.question?.length])




    const handleChange = (e) => {
        dispatch(setCurrentSection(e.target.value));
    };

    return (
        <div className="flex items-center">
            <RadioGroup value={currentSection} className="!flex-row" onChange={handleChange}>
                {sections?.length > 1 && sections.map((section) => (
                    <FormControlLabel
                        key={section.value}
                        value={section.value}
                        control={<Radio sx={{ color: "white" }} />}
                        label={
                            <Typography sx={{ fontWeight: "bold", color: "white" }}>
                                {section.label}
                            </Typography>
                        }
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "white",
                            border: "1px solid #475569",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            marginBottom: 2,
                            marginLeft: 0,
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
                    />
                ))}
            </RadioGroup>
        </div>
    );
};

export default QuestionTypeSwitch;
