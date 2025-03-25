"use client";
import { dashboardDataSelector } from "@/store/features/questions/selectors";
import { calculateCompletionRate } from "@/utils";
import Link from "next/link";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import RatingChart from "../RatingChart";
import CountUp from "react-countup";
import ReactStars from "react-rating-stars-component";

const DashboardStats = () => {
    const dashboardData = useSelector(dashboardDataSelector);

    const completionRate = useMemo(() => {
        return calculateCompletionRate(dashboardData?.testCounts) || 0;
    }, [dashboardData]);

    const getCompletionRateColor = (rate) => {
        if (rate >= 70) return "text-[#22C55E]";
        if (rate >= 50) return "text-orange-500";
        return "text-red-500";
    };

    const getRatingColor = (rate) => {
        if (rate >= 4) return "text-[#22C55E]";
        if (rate >= 3) return "text-orange-500";
        return "text-red-500";
    };

    const stats = [
        {
            title: "Assessment Completion Rate",
            value: completionRate,
            description: "Started vs completed tests",
            link: "/admin/manage-tests",
            color: getCompletionRateColor(completionRate),
        },
        {
            title: "Ongoing Assessments",
            value: dashboardData.testCounts?.onGoing || 0,
            description: "Tests in progress",
            link: "/admin/manage-tests",
        },
        {
            title: "Active Assessments",
            value: (dashboardData.testCounts?.onGoing || 0) + (dashboardData.testCounts?.pending || 0),
            description: "Tests currently being taken",
            link: "/admin/manage-tests",
        },
        {
            title: "Expired Assessments",
            value: dashboardData.testCounts?.expired || 0,
            description: "Tests expired without attempt",
            link: "/admin/manage-tests",
        },
        {
            title: "Available Questions",
            value: dashboardData.totalQuestions || 0,
            description: "Questions available for tests",
            link: "/admin/manage-skills",
        },
        {
            title: "Assessments Sent",
            value: dashboardData.testCounts?.sent || 0,
            description: "Total assessments sent to candidates",
            link: "/admin/manage-tests",
        },
        {
            title: "Completed Assessments",
            value: dashboardData.testCounts?.finished || 0,
            description: "Tests completed",
            link: "/admin/manage-tests",
        },
        {
            title: "Assessment Performance Index",
            value: parseFloat(dashboardData.feedBackData?.avgRating || 0).toFixed(2),
            description: "Average rating",
            link: "/admin/feedback",
            color: getRatingColor(dashboardData.feedBackData?.avgRating),
        },
        {
            title: "Assessment Feedback",
            value: dashboardData.feedBackData?.totalRecords || 0,
            description: "Feedbacks received",
            link: "/admin/feedback",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 bg-newCodes-background">
            {stats.map((stat, index) => (
                <Link key={index} href={stat.link} className="block">
                    <div className="bg-[#222e44] rounded-2xl shadow-lg p-5 flex flex-col justify-center gap-y-3 max-h-[220px] 
                    transition-transform duration-200 transform hover:scale-105 hover:shadow-2xl cursor-pointer items-center">
                        <h2 className="text-white text-center text-[15px] font-medium leading-[9px]">
                            {stat.title}
                        </h2>
                        <p className={`text-[40px] font-bold mt-4 text-center ${stat.color || "text-gray-200"}`}>
                            <CountUp
                                start={0}
                                end={parseFloat(stat.value)}
                                duration={2.5}
                                separator=","
                                decimals={["Assessment Completion Rate", "Performance Rating"].includes(stat.title) && !Number.isInteger(parseFloat(stat.value)) ? 1 : 0}
                            />
                            {stat.title === "Assessment Completion Rate" && "%"}
                        </p>
                        <p className="whitespace-nowrap cursor-default text-white font-medium text-[14px] text-lg mt-2 text-center">
                            {stat.description}
                        </p>
                    </div>
                </Link>
            ))}
        </div>

    );
};


export default DashboardStats;
