'use client';

import { isConnectionLostSelector } from '@/store/features/socket/selectors';
import { isChromeDesktop } from '@/utils';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ConnectionLost } from './v1/elements/ConnectionLost';


const UserLayout = ({ children }) => {

    const [isUnsupported, setIsUnsupported] = useState(false);
    const isConnectionLost = useSelector(isConnectionLostSelector)


    useEffect(() => {
        if (!isChromeDesktop()) {
            setIsUnsupported(true); // Set state to show the unsupported browser screen
        }
    }, []);

    if (isUnsupported) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#1D2126] px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-blue-400">
                        Unsupported Browser
                    </h1>
                    <p className="text-lg mt-4 text-gray-200">
                        This application works only on Chrome Desktop.
                    </p>
                    <p className="text-md mt-2 text-white">
                        Please switch to a desktop device and use Google Chrome for the best experience.
                    </p>
                </div>
            </div>
        );
    }


    return <>
        {isConnectionLost && <ConnectionLost />}
        {children}

    </>;
};

export default UserLayout;