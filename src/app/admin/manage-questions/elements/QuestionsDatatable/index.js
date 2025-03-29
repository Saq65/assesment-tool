import CustomDatatable from "@/components/molecules/CustomDatatable";
import React, { useEffect } from "react";
import { columns } from "./columns";
import useFullUrl from "@/hooks/useFullUrl";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setQuestion } from "@/store/features/questions";
import useDatatable from "@/hooks/useDatatable_old";
import { useGetAllQuestionsMutation } from "@/services/api-service/admin/questions";
import Box from "@mui/material/Box";
import CustomTabs from "@/components/atoms/CustomTabs";



const QuestionsDatatable = ({
  handleOpenDialogDel,
  handleOpenDialogQuestion,
  refetchData,
  buttons,
  setRefetchData,
  deleteMutation,
  value,
  setValue,
  selectedTab,
  setSelectedTab
}) => {


  const searchParams = useSearchParams();

  const skillId = searchParams.get("skill");
  const levelId = searchParams.get("experience");

  const [getData] = useGetAllQuestionsMutation();

  const url = useFullUrl();

  const router = useRouter();

  const dispatch = useDispatch();

  const {
    pagination,
    data,
    handlePageChange,
    handleSearch,
    clearSearch,
    fetchData,
    rowSelectionModel,
    setRowSelectionModel,

  } = useDatatable({
    key: "questions",
    mutation: getData,
    filtersData: { skillId, levelId, type: selectedTab + 1 },
  });

  useEffect(() => {
    fetchData({ currentPage: 1, query: "" });
  }, [refetchData, skillId, levelId]);




  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabs = [
    { label: "MCQ Questions" },
    { label: "Programming Questions" },
  ];


  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", }}>
          <CustomTabs
            tabs={tabs}
            value={selectedTab}
            onChange={handleTabChange}
          />
        </Box>
      </Box>
      <CustomDatatable
        columns={columns({ handleOpenDialogDel, handleOpenDialogQuestion, selectedTab })}
        rows={data}
        title={selectedTab == 0 ? "MCQ Questions" : "Programming Questions"}
        pageSize={5}
        checkboxSelection={false}
        onRowClick={(data) => {
          dispatch(setQuestion(data?.row));
          router.push(`${url}&questionId=${data?.row?.id}`);
        }}
        handlePageChange={handlePageChange}
        pagination={pagination}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        buttons={buttons}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        deleteMutation={deleteMutation}
        setRefetchData={setRefetchData}
        moduleName={"question"}
      
      />
    </>
  );
};

export default QuestionsDatatable;
