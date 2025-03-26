import React from 'react'

import SidebarHeader from '../SidebarHeader'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sideBarData } from '../data'

const SidebarFull = ({ isSidebarOpen, toggleSidebar }) => {


    const pathname = usePathname();

    const isActive = (routeName) => {
        return routeName.includes(pathname);
    };



    return (
        <>
            <div className="flex justify-center">
                <SidebarHeader />
            </div>

            <ul style={{rowGap:'0px'}} className="mr-[-10px] flex h-[90%] flex-col overflow-y-auto pr-[10px] transition-all duration-300 ease-in-out">
                {sideBarData?.map((val, i) => (
                    <li key={val?.label} className='px-3'>
                        <Link
                            href={val.route}
                            className={`nav-link flex items-center text-newCodes-sideLinks justify-start gap-2 rounded-lg px-3 py-3 transition duration-[0.4s] hover:text-newCodes-sideLinksHover ${isActive(val.routeName) ? "text-newCodes-sideLinksActive" : ""}`}
                        >
                            {val.Icon}
                            <span
                                className={`text-14 font-medium leading-24 ml-1 `}
                            >
                                {val?.fullLabel || val.label}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default React.memo(SidebarFull)