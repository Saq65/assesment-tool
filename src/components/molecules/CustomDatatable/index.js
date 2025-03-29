import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Paper, TextField, Typography } from "@mui/material";
import CustomPagination from "./CustomPagination";
import SearchInput from "@/components/atoms/SearchInput";
import Button from "@/components/atoms/Button";
import DatatableActions from "./DatatableActions";
import { Delete, Edit } from "@mui/icons-material";
import CancelIcon from '@mui/icons-material/Cancel';
import RowSelection from "../RowSelection";
import ConfirmDelete from "../ConfirmDelete";
import useDialog from "@/hooks/useDialog";
import { useDispatch, useSelector } from "react-redux";
import { deleteIdSelector } from "@/store/features/common/selectors";
import useSnackbar from "@/hooks/useSnakbar";
import { setDeleteId } from "@/store/features/common";
import { makeDeleteMessage } from "@/utils";

const CustomDatatable = ({
    columns,
    rows,
    title,
    pageSize = 5,
    rowSelectionModel,
    setRowSelectionModel,
    onRowClick,
    handlePageChange,
    pagination,
    handleSearch,
    clearSearch,
    buttons,
    deleteMutation,
    setRefetchData,
    moduleName,
    filters
}) => {


    const dispatch = useDispatch()
    const { showError, showSuccess } = useSnackbar()

    const [checkboxSelection, setCheckboxSelection] = useState(false);

    const [tableColumns, setTableColumns] = useState(columns);
    const deleteId = useSelector(deleteIdSelector)


    useEffect(() => {
        if (!checkboxSelection) {
            setTableColumns(columns)
        } else {
            let newColumn = [...columns];
            newColumn.pop()
            setTableColumns(newColumn)
        }
    }, [checkboxSelection, columns])

    const handleRowSelectionChange = (newSelection) => {
        const currentRowIds = rows.map(row => row.id); // IDs of rows on the current page

        // Find added and removed selections
        const added = newSelection.filter(id => !rowSelectionModel.includes(id));
        const removed = rowSelectionModel.filter(id => !newSelection.includes(id) && currentRowIds.includes(id));

        if (added.length > 0) {
            console.log("Checked:", added);
        }
        if (removed.length > 0) {
            console.log("Unchecked:", removed);
        }

        // Merge new selection with previous selections (preserve off-page selections)
        const mergedSelection = [
            ...rowSelectionModel.filter(id => !currentRowIds.includes(id)), // Preserve selections from other pages
            ...newSelection, // Include new selection from the current page
        ];

        if (mergedSelection?.length == 0) {
            setCheckboxSelection(false)
        }

        setRowSelectionModel([...new Set(mergedSelection)]); // Remove duplicates
    };

    const handleRemoveCheckboxSelection = () => {
        setCheckboxSelection(false);
        setRowSelectionModel([])
    }


    const { handleCloseDialog, handleOpenDialog, openDialog } = useDialog();

    const handleDelete = () => {
        deleteMutation({ id: deleteId })
            .unwrap()
            .then((res) => {
                showSuccess(res?.message);
                dispatch(setDeleteId(null)); // Edit existing skill
                setRefetchData((prev) => !prev);
                handleCloseDialog();
                setRowSelectionModel([]);
                setCheckboxSelection(false)

            })
            .catch((err) => {
                showError(err?.message);
            })
    }

    console.log(rowSelectionModel, "role selection models")

    const newLocal = <div style={{ maxHeight: 600, minHeight: 500, width: "100%", height: "100%", overflowY: "scroll", paddingRight: "10px", backgroundColor: '#272C33' }}>
        <DataGrid
            resizeThrottleMs={0}
            rows={rows}
            columns={tableColumns}
            pageSize={pageSize}
            checkboxSelection={checkboxSelection}
            // onRowSelectionModelChange={(props) => {
            //     // console.log(props, "props>>>")
            //     // setRowSelectionModel((prev) => ([...prev, ...props]))
            // }}
            onRowSelectionModelChange={handleRowSelectionChange}
            rowSelectionModel={checkboxSelection ? rowSelectionModel : []}
            // rowSelectionModel={rowSelectionModel}
            disableSelectionOnClick={true}
            // disableRowSelectionOnClick={true}
            // rowSelection={false}
            showCellVerticalBorder={false}
            showColumnVerticalBorder={false}
            hideFooterPagination
            hideFooter
            loading={pagination?.loading}
            onRowClick={!checkboxSelection && onRowClick}

            sx={{
                transition: 'all 1s ease',
                minHeight: 500,
                height: '100%',
                border: "1px solid rgba(255, 255, 255, 0.2) !important",
                width: '100% !important',
                '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#343A40 !important',
                    color: '#94A3B8',
                    fontSize: "14px",
                    fontWeight: 500,
                    lineHeight: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                },


                '& .MuiDataGrid-columnHeaderTitleContainer': {
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    flexGrow: 1,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    textAlign: 'center',
                    width: '100%',
                    display: 'block',
                    flexGrow: 1,
                },

                '& .MuiDataGrid-cell': {
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'center',
                    textAlign: 'center',
                },
                '& .MuiDataGrid-overlay': {
                    background: '#343A40 !important',
                    // border: 'none !important'
                },
                '& .MuiDataGrid-filler': {
                    backgroundColor: '#343A40 !important',
                    color: '#ffffff',
                    // border: 'none !important'
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#343A40',
                    cursor: 'pointer',
                },
                '& .MuiDataGrid-columnSeparator': {
                    visibility: 'hidden',
                },
                '& .MuiDataGrid-root': {
                    border: 'none !important',
                    boxShadow: 'none !important',
                },
                '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                    borderColor: 'none',
                },
                '& .MuiDataGrid-cell:focus-within': {
                    outline: 'none',
                    borderColor: 'none',
                },

                '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',
                    borderColor: 'none',
                },
                '& .MuiDataGrid-row.Mui-selected': {
                    background: "#343A40"
                },
                '& .MuiDataGrid-row.Mui-selected:hover': {
                    background: "#343A40"
                },


            }}
            slots={{
                noRowsOverlay: () => (
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%", // Ensure it takes full height
                        minHeight: "500px", // Match DataGrid's min height
                        width: "100%",
                        backgroundColor: "#1D2126",
                    }}
                        className="w-full h-full flex justify-center items-center bg-[#1D2126]">
                        <p className="text-white text-md">{!pagination?.loading && "No records"}</p>
                    </div>
                ),
            }} />

    </div>;
    return (
        <>
            <ConfirmDelete
                message={makeDeleteMessage(moduleName, deleteId, rowSelectionModel)} open={openDialog} onClose={() => {
                    handleCloseDialog()
                    setRowSelectionModel([])
                    setCheckboxSelection(false)
                }} onDelete={handleDelete}
            />
            <div style={{ width: "100%" }}>
                <div className="flex items-center justify-between my-5">
                    <div className="flex items-center gap-x-[10px]">
                        <Typography variant="h3" gutterBottom>
                            {title}
                        </Typography>
                        <span className="bg-[#93c5fd1a] font-semibold text-[14px] leading-[18px] flex items-center rounded-[11px] text-[#ffffff] h-[28px] px-[10px]">
                            {pagination?.total}
                        </span>
                    </div>
                    <div className="flex items-center gap-x-3">
                        <div>
                            <SearchInput handleSearch={handleSearch} clearSearch={clearSearch} />
                        </div>
                        {buttons}
                    </div>

                </div>
                <Paper sx={{ padding: 3, background: "#272C33 !important" }}>

                    <div>
                        <div
                            className={`transition-all duration-300 ease-in-out flex items-center justify-end ${checkboxSelection ? 'opacity-0 h-0 visibility-hidden' : 'opacity-100 h-auto visibility-visible'
                                }`}
                        >
                            {filters}
                            <DatatableActions handleRemoveCheckboxSelection={handleRemoveCheckboxSelection} setCheckboxSelection={setCheckboxSelection} moduleName={moduleName} append={"s"} />

                        </div>

                        <RowSelection handleOpenDialog={handleOpenDialog} checkboxSelection={checkboxSelection} setCheckboxSelection={setCheckboxSelection} rowSelectionModel={rowSelectionModel} handleRemoveCheckboxSelection={handleRemoveCheckboxSelection} />

                        {newLocal}
                    </div>
                    {/* Custom Pagination */}
                    <CustomPagination
                        handlePageChange={handlePageChange}
                        pagination={pagination}
                    />
                </Paper>
            </div>
        </>
    );
};

export default CustomDatatable;
