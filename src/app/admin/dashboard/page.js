"use client"
import PanelLayout from '@/components/layouts/PanelLayout'
import React, { useEffect } from 'react'
import DashboardStats from './elements/DashboardStats'
import { useGetDashboardDataMutation } from '@/services/api-service/admin/dashboard';
import Charts from './elements/Charts';

const statsData = [
    {
        title: 'Total Questions',
        value: 1200,
        description: 'Questions in the system',
        link: '/admin/manage-questions'
    },
    {
        title: 'Tests in Progress',
        value: 15,
        description: 'Currently active tests',
        link: '/admin/manage-tests'
    },
    {
        title: 'Ongoing Tests',
        value: 8,
        description: 'Tests currently ongoing',
        link: '/admin/manage-tests'
    },
    {
        title: 'Tests Completed',
        value: 230,
        description: 'Total tests completed',
        link: '/admin/manage-tests'
    },
    {
        title: 'Total Feedbacks',
        value: 340,
        description: 'Feedbacks received',
        link: '/admin/feedback'
    },

    {
        title: 'Platform Rating',
        value: 4.5,
        description: 'Average rating',
        link: '/admin/manage-questions'
    },

];


const Dashboard = () => {

    const [getDashboardData] = useGetDashboardDataMutation()

    useEffect(() => {
        getDashboardData()
    }, [])

    return (
        <PanelLayout  pageTitle={"Dashboard"} breadcrumbsData={[]}>
            <DashboardStats stats={statsData} />
            <Charts />
        </PanelLayout >
    )
}

export default Dashboard