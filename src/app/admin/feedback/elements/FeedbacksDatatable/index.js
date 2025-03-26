import CustomDatatable from '@/components/molecules/CustomDatatable';
import React, { useEffect } from 'react'
import { columns } from './columns';
import useFullUrl from '@/hooks/useFullUrl';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setFeedback } from '@/store/features/questions';
import useDatatable from '@/hooks/useDatatable_old';
import { useGetAllFeedbacksMutation } from '@/services/api-service/admin/feedbacks';

const FeedbacksDatatable = ({ handleOpenDialogDel, refetchData, deleteMutation, setRefetchData, moduleName }) => {


    const [getData] = useGetAllFeedbacksMutation()


    const url = useFullUrl()

    const router = useRouter()

    const dispatch = useDispatch();

    const {
        pagination,
        data,
        handlePageChange,
        handleSearch,
        clearSearch,
        fetchData,
        rowSelectionModel,
        setRowSelectionModel
    } = useDatatable({ key: "feedbacks", mutation: getData, filtersData: {} });


    useEffect(() => {

        fetchData({ currentPage: 1, query: "" })

    }, [refetchData])




    return (
        <CustomDatatable
            columns={columns({ handleOpenDialogDel })}
            rows={data}
            title="Feedback"
            pageSize={5}
            checkboxSelection={false}
            onRowClick={(data) => {
                dispatch(setFeedback(data?.row))
                router.push(`${url}?feedbackId=${data?.row?.id}`)
            }}
            handlePageChange={handlePageChange}
            pagination={pagination}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={setRowSelectionModel}
            deleteMutation={deleteMutation}
            setRefetchData={setRefetchData}
            moduleName={moduleName}
            
        />
    )
}

export default FeedbacksDatatable