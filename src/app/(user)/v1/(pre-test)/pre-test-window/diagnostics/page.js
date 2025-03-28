"use client"
import Button from '@/components/atoms/Button';
import { getTestIdFromSession, refreshPage, removeUserCookie } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
const ProctoringScreenError = () => {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    // type = 1   , Webcam and Microphone permissions
    // type = 2   , Incorect screen mode shared




    const router = useRouter();


    useEffect(() => {
        removeUserCookie();

    }, [])


    if (type == "1") {
        return (
            <div className="min-h-screen  grid grid-cols-12">
                {/* Left Section */}
                <div className="col-span-5 shadow-lg p-6 flex flex-col items-center justify-center border-r border-primary-500 relative">
                    <img
                        src="../../permission-denied.gif"
                        alt="Webcam Permissions Screenshot"
                        className="w-11/12 h-auto rounded-lg border border-gray-300"
                    />
                    <div className='absolute right-0 bg-red-600 h-[50px] w-[50px] flex items-center justify-center rounded-full' style={{
                        transform: 'translate(50%, -50%)',
                    }}>
                        <WarningAmberIcon className='text-white' />
                    </div>
                </div>

                <div className="col-span-7  flex flex-col justify-center items-center p-10">
                    <div className="text-center">
                        <h1 className="text-2xl text-left  font-bold text-red-600 mb-4">
                            You cancelled Webcam and Microphone permissions
                        </h1>
                        <p className="text-white mb-6">
                            Webcam and Microphone access permissions are required to proceed with this test.
                        </p>
                        <div className="bg-primary-100 rounded-lg shadow-sm p-4 mb-6">
                            <h2 className="text-lg font-semibold text-white mb-3 text-left">Quick Fixes:</h2>
                            <ul className="text-white list-disc pl-5 text-left">
                                <li>Follow the instructions shown on the left screen to allow the permissions</li>
                                <li>
                                    Click on the refresh button to proceed
                                </li>
                            </ul>
                        </div>
                        <div className='flex justify-start'>
                            <Button onClick={() => refreshPage(getTestIdFromSession())} className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700">
                                Refresh Browser
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );

    } else {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className=" grid-cols-1 lg:grid-cols-2  flex justify-center shadow-lg rounded-lg overflow-hidden w-full max-w-3xl">

                    {/* Right Section */}
                    <div className="p-6 flex flex-col justify-center bg-primary-100 text-gray-200">
                        <h2 className="text-red-500 text-2xl font-bold mb-4">
                            Incorrect Screen Share Mode Selected
                        </h2>
                        <p className="text-white mb-4">
                            In order to take this test, please share your Entire Screen to continue.
                        </p>
                        <div className="bg-primary-200 p-4 rounded-md mb-6">
                            <p className="font-semibold mb-2 text-gray-200">Quick Fixes:</p>
                            <ul className="list-disc pl-5 text-gray-200">
                                <li className="mb-2">Restart this test using the button below.</li>
                                <li className="mb-2">
                                    When asked for screen-share permissions, click on <strong>Start Screen Capture</strong>.
                                </li>
                                <li className="mb-2">
                                    In the screen-share popup, select the <strong>Entire Screen</strong> tab from the available tabs.
                                </li>
                                <li className="mb-2">
                                    Select the <strong>available window</strong> and click the <strong>Share</strong> button.
                                </li>
                            </ul>
                        </div>
                        <div className='flex justify-center'>
                            <Button
                                onClick={() => refreshPage(getTestIdFromSession())}
                                className="py-2 px-4 font-medium rounded-md hover:gray transition"
                                style={{ backgroundColor: "#343A40", color: "#FFFFFF",cursor:'pointer'}}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                            >
                                Restart Test
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


};

export default ProctoringScreenError;
