import React from 'react';
import SidebarHeader from '../SidebarHeader';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sideBarData } from '../data';


const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const pathname = usePathname();

    const isActive = (routeName) => {
        return routeName.includes(pathname);
    };

    return (
        <>
            <div className="flex justify-center items-end">
                <SidebarHeader />

            </div>

            <ul className="flex items-end h-[90%] flex-col overflow-y-auto transition-all duration-300 ease-in-out">
                {sideBarData?.map((val) => (
                    <li key={val?.label} className="w-full flex justify-center">
                        <Link
                            href={val.route}
                            className={`group w-full justify-center text-newCodes-sideLinks flex-col nav-link flex items-center px-3 py-2 gap-y-[1px] transition duration-[0.4s] hover:text-newCodes-sideLinksHover ${isActive(val.routeName) ? 'text-newCodes-sideLinksActive' : ''
                                }`}
                        >
                            {val.Icon}
                            {/* <span
                                className={`text-[12px] font-medium ml-1 text-white transition-all duration-300 ease-in-out ${isActive(val.routeName)
                                    ? 'opacity-100 visible'
                                    : 'opacity-0 invisible'
                                    } group-hover:opacity-100 group-hover:visible`}
                            > */}
                            <span
                                className={`text-[12px] font-medium ml-1 transition-all duration-300 ease-in-out ${isActive(val.routeName)}`}
                            >
                                {val.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Sidebar;
