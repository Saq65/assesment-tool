import React from 'react';
import { Dialog, DialogContent } from '@mui/material';

import Button from '@/components/atoms/Button';
import { useDispatch, useSelector } from 'react-redux';
import { socketSelector } from '@/store/features/socket/selectors';
import { testSelector } from '@/store/features/test/selectors';
import useLoadingError from '@/hooks/useLoadingError';
import { useRouter } from 'next/navigation';
import { countQuestions, fireEventWithAck, getAttemptedQuestionsCount, getReviwQuestionsCount, getSkippedQuestionsCount, getUnattemptedQuestionsCount } from '@/utils';
import { SOCKET_EVENTS } from '@/lib/socket/events';
import CountDownTime from '@/components/atoms/CountdownTimer';
import TimerIcon from '@mui/icons-material/Timer'; // Import Timer icon from MUI
import OverviewChart from '../OverviewChart';
import { setLoading } from '@/store/features/alerts';

const FinishTestDialog = ({ openDialog, handleCloseDialog }) => {

    const { currentIndex, testInfo } = useSelector(testSelector);


    const router = useRouter();
    const socket = useSelector(socketSelector);
    // const { loading, startLoading, stopLoading } = useLoadingError();

    const dispatch = useDispatch();

    const handleSubmit = () => {
        // startLoading();

        dispatch(setLoading(true))

        if (socket) {
            fireEventWithAck(socket, {
                eventName: SOCKET_EVENTS.FINISH_TEST,
                callback: () => {
                    dispatch(setLoading(false))
                    router.push('/v1/test-result-feedback');
                },
            });
        }

    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            sx={{

                '& .MuiDialog-paper': {
                    backgroundColor: '#272C33',
                    borderRadius: 2,
                    color: '#FFFFFF',
                    // padding: 3,
                    minWidth: "500px !important", // Set a fixed width for the dialog

                },
            }}
        >
            {/* <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    color: '#FFFFFF',
                }}
            >
                Test Summary
            </DialogTitle> */}
            <h3 className='text-[24px] leading-6 px-6 pt-10 pb-3 font-bold text-center'>Test Summary</h3>

            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    {/* Time Remaining Section */}
                    <div className="flex items-center text-sm rounded-2xl px-3 py-1 gap-x-2">
                        <span className="flex items-end text-xl font-extrabold animate-bounce">
                            <CountDownTime />
                        </span>
                    </div>

                    {/* Overview Section */}
                    <div className="text-center mt-2"> {/* Added margin for spacing */}
                        <p className="text-white text-lg font-semibold">
                            Here’s how you did so far:
                        </p>
                        {/* Optional additional text for total questions */}
                        {/* <p className="text-white text-md mt-2">
                    Total Questions: {totalQuestions}
                </p> */}
                    </div>

                    {/* Chart Section */}
                    <div className="w-full my-4 items-center flex flex-col justify-center"> {/* Added margin for spacing */}
                        <OverviewChart />
                        <div className="flex flex-col items-start justify-center flex-shrink-0 gap-y-1 mt-2">
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 bg-[#00b300] rounded-full"></span>
                                <span className="text-sm text-white">Attempted ({getAttemptedQuestionsCount(testInfo)})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 bg-yellow-700 rounded-full"></span>
                                <span className="text-sm text-white">Revisit Later ({getReviwQuestionsCount(testInfo)})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-4 h-4 bg-red-600 rounded-full"></span>
                                <span className="text-sm text-white">Unattempted ({getUnattemptedQuestionsCount(testInfo)})</span>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                                               <span className="w-4 h-4 bg-red-600 rounded-full invisible"></span>
                                               <span className="text-sm text-white">Not Visited ({getUnvisitedQuestionsCount(testInfo?.question)})</span>
                                           </div> */}
                        </div>
                    </div>
                </div>
            </DialogContent>

            <div className='flex justify-center gap-x-6 mb-10'>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={handleCloseDialog}
                    sx={{
                        minWidth: 140,
                        padding: '10px 20px',
                    }}
                    style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                >
                    Back to Test
                </Button>
                <Button
                    variant="primary"
                    size="small"
                    onClick={handleSubmit}
                    sx={{
                        minWidth: 140,
                        padding: '10px 20px',
                    }}
                    style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                >
                    {/* {loading ? (
                        <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                    ) : (
                        'Submit and End Test'
                    )} */}
                    Submit and End Test
                </Button>
            </div>

        </Dialog>

    );
};

export default FinishTestDialog;
