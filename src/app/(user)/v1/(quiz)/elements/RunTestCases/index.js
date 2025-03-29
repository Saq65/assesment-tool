import React, { useEffect, useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { CircularProgress, Box as MuiBox, Skeleton, Typography } from '@mui/material';
import CustomTabs from '@/components/atoms/CustomTabs';
import CustomTabPanel from '@/components/atoms/CustomTabPanel';
import { useDispatch, useSelector } from 'react-redux';
import { testIdSelector, testSelector } from '@/store/features/test/selectors';
import { socketSelector } from '@/store/features/socket/selectors';
import { fireEventWithAck, formatOutputView, outputMatches } from '@/utils';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import { useCompileCodeMutation } from '@/services/api-service/admin/questions';
import { CONSTANTS } from '@/constants';
import { markAsAttempted, setLoadingTestCases, updateProgram, updateProgramError, updateProgramTestCases } from '@/store/features/test';




const { TEST_CASE_STATUS } = CONSTANTS


export const formatTestCasesInputView = (input) => {

    console.log(input, "input>>>");

    const parsedInput = input && JSON.parse(input);

    return parsedInput?.map((val, index) => (
        <span key={index} className="block">
            <span className="text-blue-400 font-semibold">{`input${index + 1}`}</span>
            {' = '}
            <span className="text-green-300">{JSON.stringify(val)}</span>
        </span>
    ));
};
const RunTestCases = ({ code, language }) => {


    const [compileCode] = useCompileCodeMutation()
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [passCount, setPassCount] = useState(0);
    const [failCount, setFailCount] = useState(0);
    const [testResults, setTestResults] = useState([]); // To store test case results (passed/failed)

    const dispatch = useDispatch()

    const testState = useSelector(testSelector);
    const socket = useSelector(socketSelector)
    const testId = useSelector(testIdSelector)


    const currentQuestion = testState?.testInfo?.programs?.[testState.currentProgramIndex];


    console.log(currentQuestion?.loading, "currentQuestion>>>>.");

    useEffect(() => {
        setSelectedTab(0);

    }, [testState.currentProgramIndex])

    useEffect(() => {
        if (currentQuestion?.testCases) {
            console.log(currentQuestion?.testCases, "currentQuestion?.testCases");

            let passed = 0
            let failed = 0
            let array = currentQuestion?.testCases
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if (element?.result == TEST_CASE_STATUS.PASS) {
                    passed++
                } else if (element?.result == TEST_CASE_STATUS.FAIL) {
                    failed++
                }

            }
            setPassCount(passed)
            setFailCount(failed)
        }
    }, [currentQuestion])

    // Dynamically create tabs based on testCases
    const tabs = currentQuestion?.testCases?.map((_, index) => ({
        label: `Case ${index + 1}`,
    }));

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };


    const handleRunTests = async (questionId) => {


        dispatch(updateProgram(code))

        // setLoading(true);
        dispatch(setLoadingTestCases({ id: questionId, loading: true }))
        setPassCount(0);
        setFailCount(0);
        setTestResults([]); // Reset previous test results
        let tempPassCount = 0;
        let tempFailCount = 0;

        dispatch(updateProgramError(""))

        const results = await Promise.all(
            currentQuestion?.testCases?.map(async (testCase, index) => {
                try {
                    const res = await compileCode({
                        language: language,
                        functionCode: code,
                        functionName: "defaultFunction",
                        args: JSON.parse(testCase?.input),
                        userId: testId,
                        testCaseId: testCase?.id
                    }).unwrap();

                    if (language == "javascript") {
                        if (JSON.stringify(JSON.parse(testCase?.output)) == JSON.stringify([res?.data?.output?.functionOutput])) {
                            tempPassCount++;
                            return {
                                ...testCase,
                                result: TEST_CASE_STATUS.PASS,
                                logs: {
                                    stdout: res?.data?.output?.stdout,
                                    functionOutput: res?.data?.output?.functionOutput
                                },
                            };
                        } else {
                            tempFailCount++;
                            return {
                                ...testCase,
                                result: TEST_CASE_STATUS.FAIL,
                                logs: {
                                    stdout: res?.data?.output?.stdout,
                                    functionOutput: res?.data?.output?.functionOutput
                                },
                            };
                        }
                    } else if (language == "swift" || language == "kotlin") {


                        if (outputMatches(res?.data?.output?.functionOutput, testCase?.output)) {
                            tempPassCount++;
                            return {
                                ...testCase,
                                logs: {
                                    stdout: res?.data?.output?.stdout,
                                    functionOutput: res?.data?.output?.functionOutput
                                },
                                result: TEST_CASE_STATUS.PASS
                            };
                        } else {
                            tempFailCount++;
                            return {
                                ...testCase,
                                result: TEST_CASE_STATUS.FAIL,
                                logs: {
                                    stdout: res?.data?.output?.stdout,
                                    functionOutput: res?.data?.output?.functionOutput
                                },
                            };
                        }
                    }


                } catch (err) {

                    console.log(err, "err>>>");

                    tempFailCount++;
                    dispatch(updateProgramError(err?.errorMessage || err?.error || err?.message, testState.currentProgramIndex))
                    console.log(err, "error comes here");
                    return {
                        ...testCase,
                        result: TEST_CASE_STATUS.FAIL,
                        logs: {
                            stdout: "",
                            functionOutput: ""
                        },
                    };
                }
            })
        );

        // if (results.some((result) => result.result == TEST_CASE_STATUS.PASS)) {
        dispatch(markAsAttempted())
        fireEventWithAck(socket, {
            eventName: SOCKET_EVENTS.ADD_QUESTION_STATUS,
            payload: {
                questionStatus: {
                    [currentQuestion?.id]: "attempted",
                },
            },
        });
        // }

        setPassCount(tempPassCount);
        setFailCount(tempFailCount);
        setTestResults(results); // Set test results

        // setLoading(false); // Set loading to false once tests are done
        dispatch(setLoadingTestCases({ id: questionId, loading: false }))

    };

    useEffect(() => {

        console.log(testResults, "testResults>>>>>");

        if (testResults?.length > 0) {
            dispatch(updateProgramTestCases(testResults));
            fireEventWithAck(socket, {
                eventName: SOCKET_EVENTS.SUBMIT_CODE,
                payload: {
                    testCasesResult: testResults,
                    userInput: code,
                    programmingLanguage: language,
                    questionId: currentQuestion?.id,
                    testId: testId
                },
                callback: (res) => {
                    console.log(`SOCKET RESPONSE >>> `, res);

                }
            })
        }


    }, [testResults, socket])

    return (
        <>
            <div className="sticky top-0 text-md font-semibold flex justify-between text-white p-2 border-b border-solid border-[#32394a] bg-newCodes-foreground">
                <button>{!currentQuestion?.loading ? "Testcases" : "Running Testcases..."}</button>
                <div className='flex gap-x-2'>
                    <button
                        disabled={currentQuestion?.loading}
                        onClick={() => handleRunTests(currentQuestion?.id)}
                        className="flex items-center px-2 text-blue-300 border border-solid border-blue-300 text-[14px] rounded-lg cursor-pointer disabled:cursor-not-allowed"
                    >
                        <PlayArrowIcon />
                        {currentQuestion?.loading ? 'Running...' : 'Run'}
                    </button>
                </div>
            </div>


            <MuiBox sx={{ width: '100%' }}>
                <MuiBox sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: '42px', background: '#343A40' }}>
                    <CustomTabs
                        tabs={tabs?.map((tab, index) => ({
                            ...tab,
                            label: (
                                <div className="flex items-center">
                                    {tab.label}
                                    {currentQuestion?.loading && <CircularProgress
                                        size={20}
                                        sx={{
                                            '.MuiCircularProgress-circle': {
                                                stroke: 'white', // This applies the gray color to the circle element
                                            },
                                            marginLeft: 2
                                        }}
                                    />

                                    }

                                    {!currentQuestion?.loading && (
                                        currentQuestion?.testCases[index]?.result === 'pass' ? (
                                            <CheckCircleIcon style={{ color: 'green', marginLeft: 8 }} />
                                        ) : currentQuestion?.testCases[index]?.result === 'fail' ? (
                                            <CancelIcon style={{ color: 'red', marginLeft: 8 }} />
                                        ) : null
                                    )}
                                </div>
                            ),
                        })) || []} // Ensure tabs is an empty array if undefined
                        value={selectedTab}
                        onChange={handleTabChange}
                        type="small"
                    />
                </MuiBox>
                {/* Show Test Case Stats after running the tests */}
                {!currentQuestion?.loading ? (
                    <MuiBox className="flex justify-between mt-4 px-4 text-white">
                        <div
                            className={`flex items-center gap-x-2`}
                            style={{ order: passCount >= failCount ? 0 : 1 }}
                        >
                            <Typography variant="body2">Passed: </Typography>
                            <Typography variant="body1" className="flex items-center">
                                <CheckCircleIcon style={{ color: 'green', marginRight: 5 }} />
                                {passCount}
                            </Typography>
                        </div>
                        <div
                            className={`flex items-center gap-x-2`}
                            style={{ order: passCount >= failCount ? 1 : 0 }}
                        >
                            <Typography variant="body2">Failed: </Typography>
                            <Typography variant="body1" className="flex items-center">
                                <CancelIcon style={{ color: 'red', marginRight: 5 }} />
                                {failCount}
                            </Typography>
                        </div>
                    </MuiBox>
                ) : (
                    <MuiBox className="flex justify-between px-4 text-white">
                        <div className="flex items-center gap-x-2">
                            <Skeleton width="80px" height="50px" />
                            <Skeleton width="40px" height="50px" />
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Skeleton width="80px" height="50px" />
                            <Skeleton width="40px" height="50px" />
                        </div>
                    </MuiBox>
                )}


                {tabs && tabs.map((_, index) => (
                    <CustomTabPanel key={index} value={selectedTab} index={index}>
                        {currentQuestion?.error && <div className='px-5 py-4 flex flex-col gap-y-3'>
                            <h2 className='text-red-500 font-bold text-xl'>
                                Runtime Error
                            </h2>
                            <div className='bg-red-500 text-white rounded-md p-3 text-sm whitespace-pre-wrap break-words'>
                                {currentQuestion?.error}
                            </div>
                        </div>}
                        <div className="mt-2 overflow-y-auto">
                            <div className="flex items-center py-2 mx-4 gap-x-4">
                                <span className="text-white">Input: </span>
                                <pre className="bg-gray-600 px-4 py-2 rounded-md text-white whitespace-pre-wrap">
                                    {formatTestCasesInputView(currentQuestion?.testCases[index]?.input)}
                                </pre>
                            </div>
                            {currentQuestion?.testCases[index]?.logs?.stdout && <div className="flex items-center py-2 mx-4 gap-x-4">
                                <span className="text-white">Stdout: </span>
                                <pre className="bg-gray-600 px-4 py-2 rounded-md text-white whitespace-pre-wrap">
                                    {currentQuestion?.testCases[index]?.logs?.stdout}
                                </pre>
                            </div>}
                            {(currentQuestion?.testCases[index]?.logs?.functionOutput == "" || currentQuestion?.testCases[index]?.logs?.functionOutput) && <div className="flex items-center py-2 mx-4 gap-x-4">
                                <span className="text-white">Output: </span>
                                <pre className="bg-gray-600 min-h-[40px] min-w-[120px] px-4 py-2 rounded-md text-white whitespace-pre-wrap">
                                    {currentQuestion?.testCases[index]?.logs?.functionOutput == "" ? <span className='text-red-500'>undefined</span> : currentQuestion?.testCases[index]?.logs?.functionOutput ? JSON.stringify(currentQuestion?.testCases[index]?.logs?.functionOutput) : ""}
                                </pre>
                            </div>}



                            <div className="flex items-center py-2 mx-4 gap-x-4">
                                <span className="text-white">Expected Output: </span>
                                <pre className="bg-gray-600 px-4 py-2 rounded-md text-white  whitespace-pre-wrap">
                                    {formatOutputView(currentQuestion?.testCases[index]?.output)}
                                </pre>
                            </div>
                        </div>
                    </CustomTabPanel>
                ))}
            </MuiBox>
        </>
    );
};

export default RunTestCases;
