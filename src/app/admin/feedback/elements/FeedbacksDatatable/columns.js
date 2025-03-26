import moment from "moment";
import { Delete, Edit } from "@mui/icons-material";
import { formatDate } from "@/utils";
import { useDispatch } from "react-redux";
import { setDeleteId } from "@/store/features/common";
import StarRatings from "@/components/atoms/StarRatings";

export const columns = ({ handleOpenDialogDel }) => ([
    {
        field: "name",
        headerName: "Candidate name",
        flex: 2, // Adjusted to flex to take remaining space
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
        selectable: false,
    },
    {
        field: "email",
        headerName: "Email",
        flex: 3, // Adjusted to flex to take remaining space
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
        selectable: false,
    },
    {
        field: "rating",
        headerName: "Rating",
        flex: 2, // Adjusted to flex to take remaining space
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
        selectable: false,
        renderCell: (params) => {
            return <div className="flex justify-center items-center h-full"><StarRatings rating={params?.value} readonly={true} /></div>
        },
    },
    {
        field: "feedback",
        headerName: "Feedback",
        flex: 2, // Adjusted to flex to take remaining space
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
        selectable: false,
        renderCell: (params) => (
            <div
                style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%", // Ensures it respects column width
                }}
                title={params.value} // Shows full text on hover
            >
                {params.value}
            </div>
        )
    },

    {
        field: "createdAt",
        headerName: "Created on",
        flex: 2, // Adjusted to flex to take remaining space
        disableColumnMenu: true,
        sortable: true,
        filterable: true,
        renderCell: (params) => {
            return <span>{formatDate(params?.value)}</span>
        },
        selectable: false,
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 100, // Fixed width for the actions column
        disableColumnMenu: true,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            const dispatch = useDispatch();
            return (
                <div>
                    <Delete
                        style={{ cursor: 'pointer', color: "#EF4444" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setDeleteId(params?.row?.id));
                            handleOpenDialogDel();
                        }}
                    />
                </div>
            );
        },
    }
]);
