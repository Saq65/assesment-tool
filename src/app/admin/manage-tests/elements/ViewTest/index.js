"use client"
import Button from "@/components/atoms/Button";
import useSnackbar from "@/hooks/useSnakbar";
import { useGetTestDetailsMutation, useSendTestMutation } from "@/services/api-service/admin/questions";
import { ENDPOINTS } from "@/store/endpoints";
import { setLoading } from "@/store/features/alerts";
import { authTokenSelector } from "@/store/features/auth/selectors";
import { testSelectorAdmin } from "@/store/features/questions/selectors";
import { capitalizeAllWords, downloadPdf, formatDate, formatSkills, getPassFail, getScorePercentageAndColor } from "@/utils";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import TestStatus from "@/components/atoms/TestStatus";
import VideoPlayer from "../VideoPlayer";


const ViewTest = () => {
    const [isTestSent, setIsTestSent] = useState(false); // Tracks if the test is sent

    const searchParams = useSearchParams()
    const testId = searchParams.get("testId")

    const [getTestDetails] = useGetTestDetailsMutation();
    const [sendTest] = useSendTestMutation();


    const dispatch = useDispatch()

    const token = useSelector(authTokenSelector)
    const test = useSelector(testSelectorAdmin)

    const { showSuccess, showError } = useSnackbar()



    useEffect(() => {
        getTestDetails({ testId })
    }, [])

    const handleSendTest = () => {

        sendTest({ testId })
            .unwrap()
            .then((res) => {
                showSuccess(res?.data?.data?.message);
                setIsTestSent(true); // Update status to sent
            })
            .catch((err) => {
                showError(err?.message);
            })

    };

    const handleViewQuestions = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ADMIN.TEST.VIEW_QUESTIONS_PDF}?testId=${testId}`;
            dispatch(setLoading(true))
            await downloadPdf(url, token, capitalizeAllWords(test?.candidateName) + "-questions")
        } catch (error) {
            showError("Error fetching PDF")
        } finally {
            dispatch(setLoading(false))
        }
    };

    const handleViewResult = async (candidateName) => {

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ADMIN.TEST.TEST_RESULT_PDF}?testId=${testId}`;
            dispatch(setLoading(true))
            await downloadPdf(url, token, capitalizeAllWords(candidateName) + " Test Result")
        } catch (error) {
            showError("Error fetching PDF")
        } finally {
            dispatch(setLoading(false))
        }
    };




    return (
        <div className=" mx-auto p-8 bg-[#1D2126] rounded-lg shadow-sm mt-4 space-y-8">
            {/* Candidate Details */}
            <div className="flex justify-end"><TestStatus status={test?.status} /></div>
            <SectionBox title="Candidate details">
                <div className="md:grid grid-cols-2 gap-4">
                    <DetailRow label="Name" value={test?.candidateName} />
                    <DetailRow label="Email" value={test?.candidateEmail} />
                    <DetailRow label="Position" value={test?.candidateJobPosition} />
                    <DetailRow label="MCQ skills" value={formatSkills(test?.skillName?.map((item) => item?.name))} />
                    {test?.programSkill?.length > 0 && < DetailRow label="Programming skills" value={formatSkills(test?.programSkill?.map((item) => item?.skill))} />}
                </div>
            </SectionBox>

            {/* Test Overview */}
            <SectionBox title="Test overview">
                <div className="grid grid-cols-2 gap-4">
                    {/* <DetailRow label="Status" value={test?.status?.toUpperCase()} /> */}
                    {/* <DetailRow label="Status" value={<TestStatus status={test?.status} />} /> */}
                    {/* <DetailRow label="Total questions" value={test?.totalQuestion} /> */}
                    {test?.mcqQuestionCount && <DetailRow label="MCQ questions" value={test?.mcqQuestionCount} />}
                    {test?.programCount > 0 && <DetailRow label="Programming questions" value={test?.programCount} />}
                    <DetailRow label="Created on" value={formatDate(test?.createdAt)} />
                    {["finished", "disQualified"].includes(test?.status) && <DetailRow label="Cheating warnings" color={"#EF4444"} value={test?.totalWarning} className="font-bold" />}
                    {["finished", "disQualified"].includes(test?.status) && <DetailRow label="Attention warnings" color={"#EF4444"} value={test?.behaviorWarning} className="font-bold" />}
                    {test?.status == "finished" && <DetailRow label="Completed at" value={test?.testCompletedOn ? formatDate(+test?.testCompletedOn * 1000, true) : "-"} />}
                    {/* {test?.status == "finished" && <DetailRow label="Score" value={test?.score} color={getScorePercentageAndColor(test)?.color} className="font-bold" />} */}
                    {/* <DetailRow label="Remarks" value="-" /> */}
                </div>
            </SectionBox>

            {/* Screen Recording */}

            {test?.recordingUrl && <SectionBox title="Screen recording">
                <VideoPlayer streamUrl={test?.recordingUrl} />
            </SectionBox>}




            {/* Test Status */}
            <SectionBox title="Test status">
                <div className="grid grid-cols-2 gap-4">
                    {test?.status == "finished" && <DetailRow label="Test Result" value={getPassFail(test?.percentage).result} color={getPassFail(test?.percentage)?.color} className="font-bold" />}
                    {test?.status == "finished" && <DetailRow label="Test Score" value={getPassFail(test?.percentage).percentage} color={getPassFail(test?.percentage)?.color} className="font-bold" />}

                </div>
                <div className="grid grid-cols-2 gap-x-4 !mt-5">
                    <StatusRow label="Test sent" status={test?.isTestSent || isTestSent} />
                    <StatusRow label="Test completed" status={test?.testCompletedOn} />
                </div>

            </SectionBox>

            {/* Action Buttons */}
            <footer className="mt-8 flex justify-end space-x-4">
                {!["expired", "finished", "disQualified"].includes(test?.status) && <Button
                    onClick={handleSendTest}
                    // disabled={isTestSent || test?.isTestSent}
                    variant="primary"
                >
                    {isTestSent || test?.isTestSent ? "Resend Test" : "Send Test"}
                </Button>}
                <Button variant="primary"
                    onClick={handleViewQuestions}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                    style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}

                >
                    View Test Questions
                </Button>
                {["finished", "disQualified"].includes(test?.status) && <Button
                    onClick={() => handleViewResult(test?.candidateName)}
                    // disabled={isTestSent || test?.isTestSent}
                    variant="primary"
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#272C33")}
                    style={{ backgroundColor: "#272C33", color: "#FFFFFF" }}

                >
                    {"View Results"}
                </Button>}
            </footer>
        </div>
    );
};

const SectionBox = ({ title, children }) => (
    <div className="bg-newCodes-foreground p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);



const DetailRow = ({ label, value, color, className }) => {
    const isValueTooLong = false; // Adjust length limit based on your design

    return (
        <div className="flex flex-col gap-y-1">
            <p className="text-gray-300 font-semibold">{label}:</p>
            <div className="flex justify-between gap-x-2 items-center bg-[#1D2126] p-4 rounded-md">

                <Tooltip title={value} arrow placement="top">
                    <p
                        className={`text-gray-200 truncate ${className}`}
                        style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: color }}
                    >
                        {value}
                    </p>
                </Tooltip>
            </div>
        </div>
    );
};


const StatusRow = ({ label, status }) => (
    <div className="flex justify-between items-center bg-[#1D2126] p-4 rounded-md">
        <p className="text-gray-300 font-semibold">{label}:</p>
        <p className={status ? "text-green-500" : "text-red-500"}>
            {status ? "Yes" : "No"}
        </p>
    </div>
);

export default ViewTest;
