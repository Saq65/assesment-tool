import React from "react";
import JobProfilePerformanceSkillsChart from "../JobProfilePerformanceSkillsChart";
import JobProfileChart from "../JobProfileChart";
import { useSelector } from "react-redux";
import { dashboardDataSelector } from "@/store/features/questions/selectors";

const Charts = () => {
    const dashboardData = useSelector(dashboardDataSelector);
    console.log("njdfkesf", dashboardData)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <div className="bg-[#222e44] p-4 rounded-xl shadow-md w-full">
                    <JobProfileChart data={dashboardData?.jobProfileTestAverage} />
                </div>

                <div className="bg-[#222e44] p-4 rounded-xl shadow-md w-full">
                    <JobProfilePerformanceSkillsChart data={dashboardData?.jobPositionPerformanceBySkills} />
                </div>
            </div>
        </>

    );
};

export default Charts;