"use client";
import Button from "@/components/atoms/Button";
import { testIdSelector } from "@/store/features/test/selectors";
import { getTestIdFromSession, refreshPage, removeUserCookie } from "@/utils";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const NetworkError = () => {


    useEffect(() => {
        removeUserCookie();
    }, [])


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-primary-100 p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-blue-300 mb-4">Connection Lost</h1>
                <p className="text-white mb-6">
                    It seems like your internet connection is not stable. <br />
                    Please check your internet connection and restart the test.
                </p>
                <p className="text-white mb-6">
                    Your progress is saved. If you don't return in a few minutes, your test will be automatically submitted.
                </p>
                <Button
                    onClick={() => refreshPage(getTestIdFromSession())}
                    className="px-6 py-3 text-white font-medium rounded-md hover:bg-gray-700 transition"
                    style={{ backgroundColor: "#343A40", color: "#FFFFFF", cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#343A40")}
                >
                    Restart Test
                </Button>
            </div>
        </div>
    );
};

export default NetworkError;
