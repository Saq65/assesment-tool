"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography } from "@mui/material";

import Button from "@/components/atoms/Button";
import PanelLayout from "@/components/layouts/PanelLayout";
import Skills from "./elements/Skills";
import QuestionsDatatable from "./elements/QuestionsDatatable";
import ImportModal from "./elements/ImportModal";
import AddQuestionModal from "./elements/AddQuestionModal";
import ViewQuestion from "./elements/ViewQuestion";
import { useDispatch, useSelector } from "react-redux";
import { setDeleteId, setEditItem } from "@/store/features/common";
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useImportQuestionsMutation,
  useUpdateQuestionMutation,
} from "@/services/api-service/admin/questions";
import useSnackbar from "@/hooks/useSnakbar";
import useDialog from "@/hooks/useDialog";
import ConfirmDelete from "@/components/molecules/ConfirmDelete";
import { deleteIdSelector } from "@/store/features/common/selectors";
import {
  experienceLevelsSelector,
  skillsSelector,
} from "@/store/features/questions/selectors";
import { getExperienceLevelFromId, getSkillNameFromId } from "@/utils";
import { setQuestion } from "@/store/features/questions";
import BackButton from "@/components/atoms/BackButton";
import AddQuestionModalCoding from "./elements/AddQuestionModalCoding";

// Current route
const currentRoute = "/admin/manage-skills";

const TITLES = {
  default: "Manage Questions",
  skills: "Skills",
  selectSkill: "Select skill",
  selectExperience: "Select experience level",
  questions: "Questions",
  viewQuestion: "",
};

const ManaageQuestions = () => {
  const [value, setValue] = React.useState(0);
  const skills = useSelector(skillsSelector);
  const experienceLevels = useSelector(experienceLevelsSelector);

  const dispatch = useDispatch();
  const deleteId = useSelector(deleteIdSelector);

  const [addQuestion] = useCreateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [importQuestions] = useImportQuestionsMutation();

  const [refetchData, setRefetchData] = useState(false);

  const router = useRouter();

  const { showSuccess, showError } = useSnackbar();

  const searchParams = useSearchParams();

  const skillParam = searchParams.get("skill");
  const experienceParam = searchParams.get("experience");
  const questionId = searchParams.get("questionId");

  const [breadcrumbsData, setBreadcrumbsData] = useState([
    { label: TITLES.skills, href: currentRoute },
  ]);

  const [title, setTitle] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);


  const [ContentComponent, setContentComponent] = useState(<Skills />);

  const {
    openDialog: openDialogQuestion,
    handleCloseDialog: handleCloseDialogQuestion,
    handleOpenDialog: handleOpenDialogQuestion,
  } = useDialog();
  const {
    openDialog: openDialogImport,
    handleCloseDialog: handleCloseDialogImport,
    handleOpenDialog: handleOpenDialogImport,
  } = useDialog();
  const {
    openDialog: openDialogDel,
    handleCloseDialog: handleCloseDialogDel,
    handleOpenDialog: handleOpenDialogDel,
  } = useDialog();

  const handleAddQuestion = ({ values, resetForm }) => {

    const API_CALL = values?.questionId ? updateQuestion : addQuestion;
    API_CALL(values)
      .unwrap()
      .then((res) => {
        showSuccess(res?.message);
        handleCloseDialogQuestion();
        if (values?.questionId) {
          dispatch(setQuestion(res?.data?.data));
        }
        router.push(
          `/admin/manage-questions?skill=${values?.skillId}&experience=${values?.levelId}`
        );
        setRefetchData((prev) => !prev);
        resetForm();
      })
      .catch((err) => {
        showError(err?.message);
      });
  };

  const handleDelete = () => {
    deleteQuestion({ id: deleteId })
      .unwrap()
      .then((res) => {
        showSuccess(res?.message);
        dispatch(setDeleteId(null)); // Edit existing skill
        setRefetchData((prev) => !prev);
        handleCloseDialogDel();

        if (questionId) {
          router.back();
        }
      })
      .catch((err) => {
        showError(err?.message);
      });
  };

  const handleImport = (values) => {
    importQuestions({
      skillId: values?.skillId,
      levelId: values?.levelId,
      file: values?.file,
    })
      .unwrap()
      .then((res) => {
        showSuccess(res?.message);
        setRefetchData((prev) => !prev);
        handleCloseDialogImport();
        router.push(
          `/admin/manage-questions?skill=${values?.skillId}&experience=${values?.levelId}`
        );
      })
      .catch((err) => {
        showError(err?.message);
      });
  };

  // Update title, breadcrumbs, and content dynamically based on query parameters
  useEffect(() => {
    if (questionId) {
      setTitle(TITLES.viewQuestion);
      setContentComponent(
        <ViewQuestion
          handleOpenDialogQuestion={handleOpenDialogQuestion}
          openDialogQuestion={openDialogQuestion}
          handleOpenDialogDel={handleOpenDialogDel}
          handleCloseDialogDel={handleCloseDialogDel}
          openDialogDel={openDialogDel}
        />
      );
      setBreadcrumbsData([
        { label: TITLES.skills, href: currentRoute },
        {
          label: `${getSkillNameFromId(
            skillParam,
            skills
          )} (${getExperienceLevelFromId(experienceParam, experienceLevels)})`,
          href: `/admin/manage-questions?skill=${skillParam}&experience=${experienceParam}`,
        },
        { label: "View Question" },
      ]);
    } else if (experienceParam) {
      // setTitle(TITLES.questions);
      setContentComponent(
        <QuestionsDatatable
          value={value}
          setValue={setValue}
          setRefetchData={setRefetchData}
          deleteMutation={deleteQuestion}
          handleOpenDialogDel={handleOpenDialogDel}
          handleOpenDialogQuestion={handleOpenDialogQuestion}
          refetchData={refetchData}
          buttons={
            !questionId &&
            experienceParam && (
              <div className="flex justify-end gap-x-2">
                <Button
                  onClick={() => {
                    dispatch(setEditItem(null));
                    handleOpenDialogQuestion();
                  }}
                  size="small"
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                  style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                >
                  Add Question
                </Button>
                {selectedTab == "0" && <Button onClick={handleOpenDialogImport}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                  style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}
                  size="small">
                  Import
                </Button>}
              </div>
            )
          }
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      );
      setBreadcrumbsData([
        { label: TITLES.skills, href: currentRoute },
        // { label: getSkillNameFromId(skillParam, skills), href: `${currentRoute}?skill=${skillParam}` },
        {
          label: `${getSkillNameFromId(
            skillParam,
            skills
          )} (${getExperienceLevelFromId(experienceParam, experienceLevels)})`,
        },
      ]);
    }
    else {
      setContentComponent(<Skills />);
      setBreadcrumbsData([]);
    }
  }, [searchParams, skills, refetchData, value, selectedTab]);

  return (
    <PanelLayout pageTitle={TITLES.default} breadcrumbsData={breadcrumbsData}>
      <BackButton />
      <ImportModal
        openDialog={openDialogImport}
        handleCloseDialog={handleCloseDialogImport}
        handleImport={handleImport}
      />

      {selectedTab == "0" && <AddQuestionModal
        openDialog={openDialogQuestion}
        handleCloseDialog={handleCloseDialogQuestion}
        handleAddQuestion={handleAddQuestion}
        value={value}
        selectedTab={selectedTab}
      />}
      {selectedTab == "1" && <AddQuestionModalCoding
        openDialog={openDialogQuestion}
        handleCloseDialog={handleCloseDialogQuestion}
        handleAddQuestion={handleAddQuestion}
        value={value}
        selectedTab={selectedTab}
      />}

      <ConfirmDelete
        message="Are you sure you want to delete this question?"
        open={openDialogDel}
        onClose={handleCloseDialogDel}
        onDelete={handleDelete}
      />

      <Typography variant="h4" sx={{ marginBottom: 1.5 }}>
        {title}
      </Typography>

      {ContentComponent}
    </PanelLayout>
  );
};

export default ManaageQuestions;
