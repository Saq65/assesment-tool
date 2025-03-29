import { setDeleteId, setEditItem } from "@/store/features/common";
import { formatDate } from "@/utils";
import { Delete, Edit } from "@mui/icons-material";
import { useDispatch } from "react-redux";


export const columns = ({ handleOpenDialogDel, handleOpenDialogQuestion, selectedTab }) => {

    const columnsArray = [
        {
            field: "question", headerName: "Question", flex: 1, disableColumnMenu: true, sortable: false, filterable: false, selectable: false, renderCell: (params) => (
                <span style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "600px",
                    display: "block"
                }} title={params.value}>
                    {params.value}
                </span>)
        },
        { field: "answer", headerName: "Correct Option", width: 180, disableColumnMenu: true, sortable: false, filterable: false, selectable: false },
        {
            field: "createdAt", headerName: "Created At", width: 180, disableColumnMenu: true, sortable: false, filterable: false, selectable: false, renderCell: (params) => {
                return <span>{formatDate(params?.value)}</span>
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            disableColumnMenu: true,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const dispatch = useDispatch();
                return (
                    <div>
                        <Edit style={{ cursor: 'pointer', marginRight: 8, color: "#7DD3FC" }} onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setEditItem(params?.row));
                            handleOpenDialogQuestion();
                        }} />
                        <Delete style={{ cursor: 'pointer', color: "#EF4444" }} onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setDeleteId(params?.row?.id));
                            handleOpenDialogDel();
                        }} />
                    </div>
                )
            }
        }
    ];

    // If the type is 1, remove the 'answer' column
    if (selectedTab == 1) {
        return columnsArray.filter(column => column.field !== "answer");
    }

    return columnsArray;
};
