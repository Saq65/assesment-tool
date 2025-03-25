"use client";

import React, { useEffect, useState } from "react";
import ConfirmDelete from "@/components/molecules/ConfirmDelete";
import PanelLayout from "@/components/layouts/PanelLayout";
import AddEditSkillDialog from "./elements/AddEditSkillDialog";
import SkillCard from "./elements/SkillCard";
import { useSelector, useDispatch } from "react-redux";
import { skillsSelector } from "@/store/features/questions/selectors";
import { addSkill, editSkill, removeSkill } from "@/store/features/questions";
import { setDeleteId, setEditItem } from "@/store/features/common";
import { deleteIdSelector, editItemSelector } from "@/store/features/common/selectors";
import { useCreateSkillMutation, useDeleteSkillMutation, useUpdateSkillMutation } from "@/services/api-service/admin/skills";
import useSnackbar from "@/hooks/useSnakbar";
import Button from "@/components/atoms/Button";
import { useGetQuestionsCountMutation } from "@/services/api-service/admin/questions";
import DatatableActions from "@/components/molecules/CustomDatatable/DatatableActions";
import RowSelection from "@/components/molecules/RowSelection";
import { getSkillId } from "@/utils";

const ManageSkills = () => {

    const { showSuccess, showError } = useSnackbar();

    const [updateSkill] = useUpdateSkillMutation();
    const [createSkill] = useCreateSkillMutation();
    const [deleteSkill] = useDeleteSkillMutation();
    const [getQuestionsCount] = useGetQuestionsCountMutation()

    const dispatch = useDispatch();

    // Get skills from the Redux store
    const skills = useSelector(skillsSelector);
    const editItem = useSelector(editItemSelector);
    const deleteId = useSelector(deleteIdSelector);

    const [checkboxSelection, setCheckboxSelection] = useState(false);
    const [rowSelectionModel, setRowSelectionModel,] = useState([]);


    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [skillName, setSkillName] = useState("");
    const [editIndex, setEditIndex] = useState(null); // Track if we're editing an existing skill

    const [selected, setSelected] = useState([])

    console.log(selected, "selected>>>")
    const handleCheckboxChange = (id) => {
        setSelected((prevSelected) => {
            // Check if the id is already in the selected array
            if (prevSelected.includes(id)) {
                // Remove the id from the selected array
                return prevSelected.filter((item) => item !== id);
            } else {
                // Add the id to the selected array
                return [...prevSelected, id];
            }
        });
    };

    // Handle opening the dialog to add a new skill or edit an existing one
    const handleOpenDialog = (skill = null) => {
        if (skill !== null) {
            dispatch(setEditItem(skill))
        } else {

            dispatch(setEditItem(null))
        }
        setOpenDialog(true);
    };

    // Handle closing the add/edit skill dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditIndex(null);
        setSkillName("");
    };



    // Handle opening the delete confirmation dialog
    const handleOpenDeleteDialog = (id) => {
        dispatch(setDeleteId(id))
        setOpenDeleteDialog(true);
    };

    // Handle closing the delete confirmation dialog
    const handleCloseDeleteDialog = () => {

        setOpenDeleteDialog(false);
        dispatch(setDeleteId(null)); // Edit existing skill

    };

    // Handle deleting a skill
    const handleDeleteSkill = () => {

        deleteSkill({ id: deleteId })
            .unwrap()
            .then((res) => {
                showSuccess(res?.message);
                dispatch(removeSkill(deleteId)); // Edit existing skill
                dispatch(setDeleteId(null)); // Edit existing skill
                setSelected([])
                setCheckboxSelection(false)

            })
            .catch((err) => {
                showError(err?.message);
            })
            .finally(() => {
                handleCloseDeleteDialog();
                setOpenDeleteDialog(false);
            });
    };

    const handleSaveSkill = ({ skillName }) => {

        const skillId = editItem?.skillId || editItem?.id
        const apiCall = editItem
            ? updateSkill({ id: skillId, skillName })
            : createSkill({ name: skillName });

        apiCall
            .unwrap()
            .then((res) => {
                showSuccess(res?.message);
                if (editItem) {
                    dispatch(editSkill({ id: skillId, name: skillName })); // Edit existing skill
                } else {
                    dispatch(addSkill(res?.data)); // Add new skill
                }
                handleCloseDialog(); // Close the dialog
            })
            .catch((err) => {
                showError(err?.message);
            })
    };


    useEffect(() => {
        getQuestionsCount()
    }, [])


    return (
        <PanelLayout pageTitle="Skills">

            {/* Add Skill Button */}
            <div className="flex justify-end mr-4">
                {/* <h3 className="text-blue-400">Add new skill</h3> */}

                <button className="bg-gray-700 hover:bg-purple-700 text-white px-4 py-2 rounded-md shadow-md" onClick={() => handleOpenDialog()}>
                    Add New Skill
                </button>
            </div>

            <div className="mt-2 bg-newCodes-background p-6">

                <div
                    className={`transition-all duration-300 flex justify-end ease-in-out ${checkboxSelection ? 'opacity-0 h-0 visibility-hidden' : 'opacity-100 h-auto visibility-visible'
                        }`}
                >
                    <DatatableActions setCheckboxSelection={setCheckboxSelection} moduleName={"skills"} />
                </div>
                <RowSelection checkboxSelection={checkboxSelection} handleOpenDialog={handleOpenDeleteDialog} setCheckboxSelection={setCheckboxSelection} rowSelectionModel={selected}
                    handleRemoveCheckboxSelection={() => {
                        setCheckboxSelection(false);
                        setSelected([])
                    }} />

                {skills.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <h3 className="text-lg font-semibold">No Skills Available</h3>
                        <p className="mt-2">Please add some skills to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {skills.map((item) => (
                            <div key={item.id}>
                                <SkillCard
                                    id={item?.skillId}
                                    title={item?.name || item?.skillName}
                                    onEdit={() => handleOpenDialog(item)} // Passing the edit handler
                                    onDelete={() => handleOpenDeleteDialog(item?.skillId)} // Passing the delete handler
                                    levels={item?.levels}
                                    selected={selected.includes(getSkillId(item))}
                                    showOptions={false}
                                    handleCheckboxChange={handleCheckboxChange}
                                    onClick={handleCheckboxChange}
                                    checkboxSelection={checkboxSelection}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>


            <AddEditSkillDialog
                openDialog={openDialog}
                handleCloseDialog={handleCloseDialog}
                handleSaveSkill={handleSaveSkill}
                skillName={skillName}
                setSkillName={setSkillName}
                editIndex={editIndex}

            />

            <ConfirmDelete message={Array.isArray(deleteId) && deleteId.length > 1 ? "Are you sure you want to delete these skills ?" : "Are you sure you want to delete this skill ?"} open={openDeleteDialog} onClose={() => {
                handleCloseDeleteDialog()
                setSelected([])
                setCheckboxSelection(false)
            }} onDelete={handleDeleteSkill} />
        </PanelLayout>
    );
};

export default ManageSkills;
