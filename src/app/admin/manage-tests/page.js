"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import PanelLayout from "@/components/layouts/PanelLayout";
import Button from "@/components/atoms/Button";
import TestsDatatable from "./elements/TestsDatatable";
import ViewTest from "./elements/ViewTest";
import GenerateTestModal from "./elements/GenerateTestModal";
import ConfirmDelete from "@/components/molecules/ConfirmDelete";
import useDialog from "@/hooks/useDialog";
import useSnackbar from "@/hooks/useSnakbar";
import { deleteIdSelector } from "@/store/features/common/selectors";
import { setDeleteId } from "@/store/features/common";
import {
    useDeleteTestMutation,
    useGenerateTestMutation,
    useGetAllJobPositionsMutation,
} from "@/services/api-service/admin/questions";
import { useGetAllLevelsMutation } from "@/services/api-service/admin/skills";
import BackButton from "@/components/atoms/BackButton";

const currentRoute = "/admin/manage-tests";

const ManageTest = () => {


    const [getAllJobPositions] = useGetAllJobPositionsMutation();

    useEffect(() => {
        getAllJobPositions()
    }, [])

    const [filters, setFilters] = useState([
        { id: 1, filterType: "Test Status", statusInput: [], timePeriodValue: "", jobPositionValue: [] } // Default filter with centralized state
    ]);

    // Router and Redux
    const router = useRouter();
    const dispatch = useDispatch();

    // Hooks and State
    const searchParams = useSearchParams();
    const { showError, showSuccess } = useSnackbar();
    const deleteId = useSelector(deleteIdSelector);

    const [generateTest] = useGenerateTestMutation();
    const [deleteTest] = useDeleteTestMutation();

    const [refetchData, setRefetchData] = useState(false);
    const [breadcrumbsData, setBreadcrumbsData] = useState([
        { label: "Tests", href: currentRoute },
    ]);

    const [getAllLevels] = useGetAllLevelsMutation()


    useEffect(() => {
        getAllLevels().unwrap()
    }, [])

    const {
        openDialog: openGenerateDialog,
        handleCloseDialog: closeGenerateDialog,
        handleOpenDialog: openGenerateDialogHandler,
    } = useDialog();

    const {
        openDialog: openDeleteDialog,
        handleCloseDialog: closeDeleteDialog,
        handleOpenDialog: openDeleteDialogHandler,
    } = useDialog();

    const testId = searchParams.get("testId");

    // Effects
    useEffect(() => {
        if (testId) {
            setBreadcrumbsData([
                { label: "Tests", href: currentRoute },
                { label: "View Test" },
            ]);
        } else {
            setBreadcrumbsData([{ label: "Tests", href: currentRoute }]);
        }
    }, [testId]);

    // Handlers
    const handleDelete = () => {
        deleteTest({ id: deleteId })
            .unwrap()
            .then((res) => {
                showSuccess(res?.message);
                dispatch(setDeleteId(null));
                setRefetchData((prev) => !prev);
                closeDeleteDialog();
                getAllJobPositions();
            })
            .catch((err) => {
                showError(err?.message);
            });
    };

    const handleGenerateTest = (payload) => {
        generateTest(payload)
            .unwrap()
            .then((res) => {
                showSuccess(res?.message);
                router.push(`/admin/manage-tests?testId=${res?.data?.testId}`);
                closeGenerateDialog();
                getAllJobPositions();
            })
            .catch((err) => {
                showError(err?.message);
            });
    };

    // Rendering
    return (
        <PanelLayout pageTitle="Assesments" breadcrumbsData={breadcrumbsData}>
            {testId && <BackButton />}
            {testId ? (
                <ViewTest />
            ) : (
                <TestsDatatable
                    buttons={
                        <div className="flex justify-end">
                            <button className="btn btn-primary text-light" size="medium" onClick={openGenerateDialogHandler}>
                                Generate Test
                            </button>
                        </div>
                    }
                    filters={filters}
                    setFilters={setFilters}
                    handleOpenDialogDel={openDeleteDialogHandler}
                    refetchData={refetchData}
                    handleOpenDialog={openGenerateDialogHandler}
                    setRefetchData={setRefetchData}
                    deleteMutation={deleteTest}
                    moduleName="test"
                />
            )}

            <GenerateTestModal
                openDialog={openGenerateDialog}
                handleCloseDialog={closeGenerateDialog}
                handleGenerateTest={handleGenerateTest}
            />

            <ConfirmDelete
                message="Are you sure you want to delete this test?"
                open={openDeleteDialog}
                onClose={closeDeleteDialog}
                onDelete={handleDelete}
            />
        </PanelLayout>
    );
};

export default ManageTest;
