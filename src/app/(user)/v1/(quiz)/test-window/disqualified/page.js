"use client";

import Button from "@/components/atoms/Button";
import { testSelector } from "@/store/features/test/selectors";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';

const NavigationWarning = () => {

    const { testInfo } = useSelector(testSelector);


    const router = useRouter()
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-300">
            <div className="bg-newCodes-foreground p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                    Test Auto-Submitted
                </h1>
                <p className="mb-6 ">

                    <span className="font-bold text-red-600">
                        Your test has been automatically submitted after 3 warnings due to suspicious activity.
                    </span>
                </p>
                <p className="text-white mb-6">
                    <span className="font-bold">
                        Please ensure a distraction-free environment <br></br> and adhere to the test guidelines to avoid this in the future.
                    </span>
                </p>

                <div className="">
                    <p className="mb-2 text-white"> For any concerns, feel free to contact our support team.</p>
                    <p className='flex items-center justify-center text-sm text-white'>
                        <LocalPhoneIcon className="mr-1" />
                        <a
                            href="tel:+18002656038"
                            className="text-white font-medium underline hover:underline"
                        >
                            +91 98779 - 72841
                        </a>
                        &nbsp; | &nbsp;
                        <EmailIcon className="mr-1" />
                        <a
                            href="mailto:hr@crebos.com"
                            className="text-white font-medium underline hover:underline"
                        >
                            hr@crebos.online
                        </a>
                    </p>
                </div>
                {/* <Button
                    onClick={() => {
                        router.push("/v1/test-window")
                    }}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                    Go Back
                </Button> */}
            </div>
        </div>
    );
};

export default NavigationWarning;
