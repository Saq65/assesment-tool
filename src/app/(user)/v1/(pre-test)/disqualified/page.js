"use client";
import React from 'react';

const Page = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-181px)] bg-newCodes-foreground">
            <div className="bg-primary-100 p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4 leading-relaxed">
                    Test Auto-Submitted
                </h1>
                <p className="mb-6 text-red-600 leading-relaxed">
                    Your test has been automatically submitted after <span className="font-bold">3 warnings</span>
                    due to suspicious activity.
                </p>
                <p className="text-white leading-relaxed">
                    Please ensure a distraction-free environment and adhere to the test guidelines
                    to avoid this in the future.
                </p>
            </div>
        </div>
    );
};

export default Page;
