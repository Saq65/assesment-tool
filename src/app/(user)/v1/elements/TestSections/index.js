import React, { useState } from "react";
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import { Typography } from "@mui/material";
import Button from "@/components/atoms/Button";
import { enterFullScreen } from "@/utils";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentSection, setIsFullScreen } from "@/store/features/test";
import { userAuthSelector } from "@/store/features/userAuth/selectors";
import { currentSectionSelector } from "@/store/features/test/selectors";
import { CONSTANTS } from "@/constants";
const { TEST_SECTIONS } = CONSTANTS;

const TestSections = ({ canProceed }) => {

  const { user } = useSelector(userAuthSelector)
  const currentSection = useSelector(currentSectionSelector);


  const dispatch = useDispatch();
  const router = useRouter();


  const handleChange = (e) => {
    dispatch(setCurrentSection(e.target.value));
  };

  return (
    <>
      <p className="text-white mb-4">
        Select the section you would like to attempt first and then click on
        Start Test button.
      </p>
      <div>
        <RadioGroup value={currentSection} onChange={handleChange}>
          <FormControlLabel
            value={TEST_SECTIONS.MCQ}
            control={<Radio sx={{ color: "white" }} />}
            label={
              <Typography sx={{ fontWeight: "bold", color: "white" }}>
                MCQ - {user?.questions || user?.questionsLength} Questions
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
          <FormControlLabel
            value={TEST_SECTIONS.PROGRAM}
            control={<Radio sx={{ color: "white" }} />}
            autoFocus={false}
            label={
              <Typography sx={{ fontWeight: "bold", color: "white" }}>
                Code - {user?.programs} Questions
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
        </RadioGroup>
      </div>
      <p className="text-white">
        <span className="text-red-500">*</span>These sections are without any
        specific time limit. You can answer these sections within the total
        assessment time limit.
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          disabled={!canProceed}
          onClick={() => {
            enterFullScreen();
            dispatch(setIsFullScreen(true));
            router.push("/v1/monitored-session");
          }}
          style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
        >
          Start Test
        </Button>
      </div>
    </>
  );
};

export default TestSections;
