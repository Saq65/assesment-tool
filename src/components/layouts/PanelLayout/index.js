
import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '@/components/molecules/Sidebars/Sidebar';
import BreadCrumbs from '@/components/molecules/Breadcrumbs';
import ProfileDropdown from '@/components/molecules/ProfileDropdown';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import SidebarFull from '@/components/molecules/Sidebars/SidebarFull';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarSelector } from '@/store/features/auth/selectors';
import { setIsSidebarOpen } from '@/store/features/auth';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const PanelLayout = ({ children, pageTitle, breadcrumbsData }) => {


    const isSidebarOpen = useSelector(sidebarSelector)
    const dispatch = useDispatch()


    const toggleSidebar = () => {
        dispatch(setIsSidebarOpen(!isSidebarOpen))
    };

    return (
        <div className="main-container">
            <div className={`relative left-0 top-0 block md:pl-[90px] duration-300 transition-all`}
                style={{
                    paddingLeft: isSidebarOpen ? "210px" : "90px"
                }}
            >
                <div className="sticky top-0 z-20 flex w-full flex-wrap items-start gap-y-4 border-b-[0.5px] border-primary-400 bg-newCodes-background text-white px-[32px] py-[12px]">
                    <div className="relative">
                        <div
                            className={`fixed left-0 top-0 z-10 h-full  transition-all duration-300 ease-in-out md:block `}
                            style={{
                                width: isSidebarOpen ? "210px" : "90px"
                            }}
                        >
                            <button
                                onClick={toggleSidebar}
                                className="absolute flex justify-center items-center h-[22px] w-[22px] bg-[#334155] transition-all duration-300 ease-in-out  rounded-full top-[24px] opacity-70"
                                style={{
                                    left: isSidebarOpen ? "195px" : "78px", // Smoothly moves during transition
                                }}
                            >
                                <KeyboardArrowRightIcon
                                    fontSize='18px'
                                    // className="!h-6 !w-6"
                                    sx={{
                                        transform: isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease", // Matches the sidebar's duration
                                    }}
                                />
                                {/* <MenuOpenIcon
                                    className="!h-6 !w-6"
                                    sx={{
                                        transform: !isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease", // Matches the sidebar's duration
                                    }}
                                /> */}
                            </button>
                            <div className="h-full bg-newCodes-foreground py-27">
                                {isSidebarOpen ? <SidebarFull
                                    isSidebarOpen={isSidebarOpen}
                                    toggleSidebar={toggleSidebar}
                                    setIsSidebarOpen={setIsSidebarOpen}
                                /> : <Sidebar
                                    isSidebarOpen={isSidebarOpen}
                                    toggleSidebar={toggleSidebar}
                                    setIsSidebarOpen={setIsSidebarOpen}
                                />}
                            </div>
                        </div>

                    </div>

                    <div className='flex items-center justify-between w-full'>
                        <BreadCrumbs pageTitle={pageTitle} breadcrumbsData={breadcrumbsData} />
                        <ProfileDropdown />
                    </div>
                </div>
                <div className="h-full bg-newCodes-background px-6 py-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PanelLayout