"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/atoms/TextInput";
import CustomSelect from "@/components/atoms/CustomSelect";
import { useSelector } from "react-redux";
import { editItemSelector } from "@/store/features/common/selectors";
import {
  experienceLevelsSelector,
  skillsSelector,
} from "@/store/features/questions/selectors";
import { useSearchParams } from "next/navigation";
import Button from "@/components/atoms/Button";
import TestCasesInput from "@/components/atoms/TestCasesInput";
import { CONSTANTS } from "@/constants";
import { initialTestCases } from "@/utils";
import { GridCloseIcon } from "@mui/x-data-grid";
const { PROGRAMMING_LANGUAGES } = CONSTANTS
const AddQuestionModalCoding = ({
  openDialog,
  handleCloseDialog,
  handleAddQuestion,
  value,
}) => {

  const scrollableContentRef = useRef()


  const searchParams = useSearchParams();

  const skillParam = searchParams.get("skill");
  const experienceParam = searchParams.get("experience");

  const skills = useSelector(skillsSelector);
  const levels = useSelector(experienceLevelsSelector);

  const editItem = useSelector(editItemSelector);




  // Helper function to validate array structure recursively
  const validateArrayStructure = (value) => {
    try {
      const parsed = JSON.parse(value);

      // Helper function to check if a value is a valid array, object, string, or number
      const isValidValue = (val) => {
        if (Array.isArray(val)) {
          // Recursively validate array items
          return val.every(item => isValidValue(item));
        } else if (typeof val === 'object' && val !== null) {
          // If it's an object, it's valid
          return true;
        } else if (typeof val === 'string') {
          // If it's a string, it's valid
          return true;
        } else if (typeof val === 'number') {
          // If it's a number, it's valid
          return true;
        }
        return false;
      };

      return Array.isArray(parsed) && parsed.every(item => isValidValue(item));
    } catch (e) {
      return false;
    }
  };

  const isValidJSON = (value) => {
    try {
      const parsed = JSON.parse(value);

      // Check if the parsed value is an array
      if (!Array.isArray(parsed)) {
        return false;
      }

      // Additional checks can be added here for specific data types in the array

      return true;
    } catch (e) {
      return false;
    }
  };


  const validationSchema = Yup.object({
    question: Yup.string().required("Question is required"),
    skillId: Yup.string().required("Skill is required"),
    levelId: Yup.string().required("Experience level is required"),
    programmingLanguage: Yup.string().required("Programming Language is required"),
    duration: Yup.number()
      .required("Duration is required")
      .typeError("Duration must be a valid number"),
    testCases: Yup.array().of(
      Yup.object({
        input: Yup.string()
          .required('Input is required')
          .test('is-valid-json', 'Input must be a valid array (e.g., [1, [2, 3], {key: "value"}])', isValidJSON),  // Custom test
        output: Yup.string().required('Output is required').test('is-valid-json', 'Output must be a valid array (e.g., [1, [2, 3], {key: "value"}])', isValidJSON),  // Custom test,
      })
    ),
  });






  const initialValues = {
    skillId: skillParam,
    levelId: experienceParam,
    programmingLanguage: "",
    duration: "",
    testCases: initialTestCases()
  }


  // useFormik hook to manage form state and validation
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values, "values>>>");

      handleAddQuestion({
        values: { ...values, questionId: editItem?.id, type: "program" },
        resetForm,
      }); // handle adding question
    },
  });


  console.log(formik, "formik>>>");




  useEffect(() => {
    if (!openDialog) {
      formik?.resetForm();
    }

    if (editItem) {
      formik.setValues({
        question: editItem?.question,
        programmingLanguage: editItem?.programmingLanguage,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        testCases: editItem?.testCases,
        correctOption: editItem?.answer,
        skillId: skillParam,
        levelId: experienceParam,
        duration: editItem?.duration,
      });
    } else {
      formik.setValues(initialValues);
    }
  }, [editItem, openDialog]);


  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#1D2126",
          minWidth: "400px",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle className="text-white flex items-center text-center font-semibold text-xl">
        <h3 className="text-[18px] leading-6 px-6 py-2 font-bold">
          {editItem ? "Edit" : "Add"} Question Coding
        </h3>
        <IconButton
          aria-label="close"
          onClick={handleCloseDialog}
          sx={{
            position: "absolute",
            right: 8,
            color: "white",
          }}
        >
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>

      <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <DialogContent
          sx={{
            paddingTop: "10px !important",
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "calc(100vh - 300px)",
            paddingBottom: 5,
            scrollBehavior: "smooth",
          }}
          ref={scrollableContentRef}
        >
          {/* Question Text */}

          {/* Select Skill */}
          <CustomSelect
            name="skillId"
            label="Skill"
            value={formik.values.skillId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.skillId}
            helperText={formik.errors.skillId}
            touched={formik.touched.skillId}
            options={skills}
          />

          {/* Select Experience Level */}
          <CustomSelect
            name="levelId"
            label="Experience Level"
            value={formik.values.levelId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.levelId}
            helperText={formik.errors.levelId}
            touched={formik.touched.levelId}
            options={levels}
          />

          {/* Select Programming Language */}
          <CustomSelect
            name="programmingLanguage"
            label="Programming Language"
            value={formik.values.programmingLanguage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.programmingLanguage}
            helperText={formik.errors.programmingLanguage}
            touched={formik.touched.programmingLanguage}
            options={PROGRAMMING_LANGUAGES}
          />


          <CustomInput
            name="question"
            label="Question"
            value={formik.values.question}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.question}
            helperText={formik.errors.question}
            touched={formik.touched.question}
            multiline={true}
            rows={10}
          />

          {/* Duration */}
          <CustomInput
            name="duration"
            label="Duration (in minutes)"
            value={formik.values.duration}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numeric values and disallow leading zeros
              if (/^[1-9]\d*$|^$/.test(value)) {
                formik.setFieldValue("duration", value);
              }
            }}
            onBlur={formik.handleBlur}
            error={formik.errors.duration}
            helperText={formik.errors.duration}
            touched={formik.touched.duration}
          />

          <TestCasesInput formik={formik} scrollableContentRef={scrollableContentRef} />
        </DialogContent>
        <div className="sticky bottom-0 bg-[#1D2126] z-10 flex justify-end px-6 py-5 gap-x-2">
          <Button
            onClick={handleCloseDialog}
            variant="secondary"
            size="small"
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
            style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary"
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
            style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
            size="small"
          >
            {editItem ? "Update Question" : "Add Question"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}




export default AddQuestionModalCoding;
