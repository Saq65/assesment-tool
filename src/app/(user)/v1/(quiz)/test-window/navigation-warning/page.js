"use client";

import Button from "@/components/atoms/Button";
import { testSelector } from "@/store/features/test/selectors";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const NavigationWarning = () => {

    const { testInfo } = useSelector(testSelector);


    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-300">
            <div className="bg-[#272C33] p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    {/* Navigated Away (Warning: 1/3) */}
                    Navigated Away (Warning: {testInfo?.warning}/{testInfo?.maxAllowedWarning})
                </h1>
                <p className="text-white mb-3">
                    {/* You have been reported for navigating away from the test window. */}
                    You navigated away from the test window. This has been recorded as a warning.
                </p>
                <p className="text-white mb-6 font-bold">
                    {/* <span className="font-bold">Do not repeat this behaviour.</span> Otherwise, you will get disqualified. */}
                    Please avoid switching tabs or looking away. Further violations may lead to disqualification
                </p>
                <Button
                    onClick={() => {
                        router.push("/v1/test-window")
                    }}
                    className="px-6 py-3 text-white font-medium rounded-md hover:bg-gray-700 transition"
                    style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                >
                    Got It
                </Button>
            </div>
        </div>
    );
};

export default NavigationWarning;
