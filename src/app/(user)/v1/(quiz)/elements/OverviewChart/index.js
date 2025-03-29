"use client"
import { testSelector } from '@/store/features/test/selectors';
import { countQuestions } from '@/utils';
import dynamic from 'next/dynamic';
import React from 'react'
import { Box, CircularProgress } from '@mui/material';

const Chart = dynamic(() => import("react-apexcharts"), {
    ssr: false, loading: () => (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={330}
        >
            <CircularProgress />
        </Box>
    )
});

import { useSelector } from 'react-redux';

const OverviewChart = () => {
    const { testInfo } = useSelector(testSelector);


    // Ensure valid data from countQuestions
    const { totalQuestions = 0, attempted = 0, unattempted = 0, review = 0 } = countQuestions(testInfo || []);

    // Chart data series with fallback for undefined values
    const chartSeries = [attempted, unattempted, review].map(item => item ?? 0);

    const labels = ["Attempted", "Unattempted", "Marked for Revisit"]

    // Chart options configuration
    const chartOptions = {
        chart: {
            type: 'donut',
            events: {
                click: function (event, chartContext, config) {
                    return false;
                }
            },
        },
        labels: [
            ` &nbsp;Attempted`,
            `&nbsp;Unattempted`,
            `&nbsp;Revisit Later`
        ],
        colors: ['green', '#DC2626', '#F97316'],
        legend: {
            show: false,
            fontSize: '16px',
            horizontalAlign: 'center',
            position: 'bottom',
            // offsetY: 90,
            labels: { colors: '#FFFFFF' },
            onItemClick: { toggleDataSeries: false },
            onItemHover: { highlightDataSeries: false },
            formatter: function (val, opts) {
                const dataIndex = opts?.seriesIndex;
                const seriesValue = opts?.w?.globals?.series?.[dataIndex] || 0;
                return `&nbsp;${labels[dataIndex]} : ${seriesValue}`;
            },
        },
        dataLabels: {
            enabled: false,
            style: { colors: ['#FFFFFF'], fontSize: '18px' },
            formatter: function (val, opts) {
                const dataIndex = opts?.seriesIndex;
                const seriesValue = opts?.w?.globals?.series?.[dataIndex] || 0;
                return `${seriesValue || 0}`;
            },
        },
        textAnchor: 'end',
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontWeight: 600,
                            fontSize: '20px',
                            color: "#fffff",
                            offsetY: -10,
                            formatter: function (val) { return val || 0 }
                        },
                        value: {
                            show: true,
                            fontSize: '26px',
                            fontWeight: 600,
                            color: '#ffffff',
                            offsetY: 16,
                            formatter: function (val) { return totalQuestions || 0 }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: `Total Questions`,
                            fontSize: '20px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 600,
                            color: '#ffffff',
                            formatter: function (w) { return totalQuestions || 0 }
                        }
                    },
                },
            },
        },
        stroke: { width: 0 },
    };

    return (
        <Chart options={chartOptions} series={chartSeries} type="donut" height={280} />
    );
};

export default React.memo(OverviewChart);
