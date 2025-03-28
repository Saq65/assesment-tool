"use client";
import Button from '@/components/atoms/Button';
import { testIdSelector } from '@/store/features/test/selectors';
import { getTestIdFromSession, refreshPage, removeUserCookie } from '@/utils';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProctoringError = () => {

    const testId = useSelector(testIdSelector)

    useEffect(() => {
        removeUserCookie();
    }, [])


    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <div className="bg-[#272C33] p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-300 mb-4">Screen Share or Camera Issue Detected</h1>
                <p className="text-white mb-6">
                    It looks like your screen sharing or camera isn’t responding. <br />
                    Please check your settings and restart the test.
                </p>
                <p className="text-white mb-6">
                    Don’t worry – your progress is safe! If you’re unable to return in a few minutes, we’ll automatically submit your test.
                </p>
                <Button
                    onClick={() => refreshPage(getTestIdFromSession())}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                    Restart Test
                </Button>
            </div>
        </div>
    );
};

export default ProctoringError;
