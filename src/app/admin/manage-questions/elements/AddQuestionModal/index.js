"use client";

import React, { useEffect } from "react";
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
import { GridCloseIcon } from "@mui/x-data-grid";

// Example skill options
const skills = ["React", "Node.js", "JavaScript", "Python", "Java"];
// Experience levels
const experienceLevels = ["Intermediate", "Advanced"];

// Define correct options for the MCQ
const correctOptions = [
  {
    title: "A",
    id: "A",
  },
  {
    title: "B",
    id: "B",
  },
  {
    title: "C",
    id: "C",
  },
  {
    title: "D",
    id: "D",
  },
];

const AddQuestionModal = ({
  openDialog,
  handleCloseDialog,
  handleAddQuestion,
  value,
  selectedTab
}) => {
  const searchParams = useSearchParams();

  const skillParam = searchParams.get("skill");
  const experienceParam = searchParams.get("experience");
  const questionId = searchParams.get("questionId");

  const skills = useSelector(skillsSelector);
  const levels = useSelector(experienceLevelsSelector);

  const editItem = useSelector(editItemSelector);


  // Form validation schema with Yup
  const validationSchema = Yup.object({
    question: Yup.string().required("Question is required"),
    optionA: Yup.string().required("Option A is required"),
    optionB: Yup.string().required("Option B is required"),
    optionC: Yup.string().required("Option C is required"),
    optionD: Yup.string().required("Option D is required"),
    correctOption: Yup.string().required("Correct option is required"),
    skillId: Yup.string().required("Skill is required"),
    // experienceLevel: Yup.string().required('Experience level is required'),
    levelId: Yup.string().required("Experience level is required"),
    duration: Yup.number()
      .required("Duration is required")
      .typeError("Duration must be a valid number"),
  });

  // useFormik hook to manage form state and validation
  const formik = useFormik({
    initialValues: {
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "",
      skillId: skillParam,
      levelId: experienceParam,
      duration: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleAddQuestion({
        values: { ...values, questionId: editItem?.id, type: "question" },
        resetForm,
      }); // handle adding question
    },
  });

  useEffect(() => {
    if (!openDialog) {
      formik?.resetForm();
    }

    if (editItem) {
      formik.setValues({
        question: editItem?.question,
        optionA: editItem?.choices?.[0],
        optionB: editItem?.choices?.[1],
        optionC: editItem?.choices?.[2],
        optionD: editItem?.choices?.[3],
        correctOption: editItem?.answer,
        skillId: skillParam,
        levelId: experienceParam,
        duration: editItem?.duration,
      });
    } else {
      formik.setValues({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "",
        skillId: skillParam,
        levelId: experienceParam,
        duration: "",
      });
    }
  }, [editItem, openDialog]);

  if (value == 0) {
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

        <DialogTitle className="text-white text-center font-semibold text-xl">
          <h3 className="text-[18px] leading-6 px-6 py-2 font-bold">
            {editItem ? "Edit" : "Add"} Question
          </h3>
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
            }}
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

            {/* Option A */}
            <CustomInput
              name="optionA"
              label="Option A"
              value={formik.values.optionA}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.optionA}
              helperText={formik.errors.optionA}
              touched={formik.touched.optionA}
            />

            {/* Option B */}
            <CustomInput
              name="optionB"
              label="Option B"
              value={formik.values.optionB}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.optionB}
              helperText={formik.errors.optionB}
              touched={formik.touched.optionB}
            />

            {/* Option C */}
            <CustomInput
              name="optionC"
              label="Option C"
              value={formik.values.optionC}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.optionC}
              helperText={formik.errors.optionC}
              touched={formik.touched.optionC}
            />

            {/* Option D */}
            <CustomInput
              name="optionD"
              label="Option D"
              value={formik.values.optionD}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.optionD}
              helperText={formik.errors.optionD}
              touched={formik.touched.optionD}
            />

            {/* Select Experience Level */}
            <CustomSelect
              name="correctOption"
              label="Correct Option"
              value={formik.values.correctOption}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.correctOption}
              helperText={formik.errors.correctOption}
              touched={formik.touched.correctOption}
              options={correctOptions}
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
              size="small">
              {editItem ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </form>
      </Dialog>
    );    
  }

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#1D2126",
          minWidth: "400px",
          overflow: "hidden",
        },
      }}
    >
      <h3 className="text-[18px] leading-6 px-6 py-5 font-bold">
        {editItem ? "Edit" : "Add"} Question
      </h3>
      <form
        onSubmit={formik.handleSubmit}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <DialogContent
          sx={{
            paddingTop: "10px !important",
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "calc(100vh - 320px)",
            paddingBottom: 5,
          }}
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
        </DialogContent>
        <div className="sticky bottom-0 bg-[#1D2126] z-10 flex justify-end px-6 py-5 gap-x-2">
          <Button onClick={handleCloseDialog} variant="secondary"
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
            style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
            size="small">
            Cancel
          </Button>
          <Button type="submit" variant="primary"
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
            style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
            size="small">
            {editItem ? "Update Question" : "Add Question"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default AddQuestionModal;
