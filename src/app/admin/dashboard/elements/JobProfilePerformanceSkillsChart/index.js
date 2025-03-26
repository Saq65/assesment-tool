"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CustomSelect from '@/components/atoms/CustomSelect';
import { colors } from '@mui/material';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const JobProfilePerformanceSkillsChart = ({ data = [] }) => {
    const [selectedPosition, setSelectedPosition] = useState(data[0]?.position || '');

    const selectedData = data.find((item) => item.position === selectedPosition)?.skillAverage || [];

    const handleChange = (event) => {
        setSelectedPosition(event.target.value);
    };

    const chartData = {
        series: [
            {
                name: 'Average',
                data: selectedData.map((item) => parseFloat(item.average)),
            },
        ],
        options: {
            states: {
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            chart: {
                type: 'bar',
                toolbar: {
                    show: false,
                },
            },
            grid: {
                show: true,
                borderColor: '#334155',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    endingShape: 'rounded',
                    dataLabels: {
                        position: 'top', // Position data labels at the top of the bars
                    },
                    columnWidth: '25px',
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => `${val}%`,
                offsetY: -18, // Adjust this value to fine-tune the vertical position of the labels
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    colors: ['#94A3B8'],
                },
            },
            xaxis: {
                categories: selectedData.map((item) => item.skillName),
                labels: {
                    style: {
                        fontSize: '10px',
                        colors: '#94A3B8',
                    },
                    rotate: -45,
                    formatter: (val) =>
                        val.length > 10 ? `${val.substring(0, 10)}...` : val,
                },
                axisBorder: {
                    color: '#334155',
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                max: 100,
                labels: {
                    style: {
                        colors: '#94A3B8',
                    },
                    formatter: function (value) {
                        return `${Math.floor(value)}%`; // Remove decimal places by rounding down
                    },
                },
            },
            colors:['#1F51FF'],
            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const fullName = selectedData[dataPointIndex]?.skillName;
                        return `${fullName}: ${val}%`;
                    },
                },
                theme: 'light',
            },
            legend: {
                show: true,
                position: 'bottom',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 12,
                },
                labels: {
                    colors: '#333',
                    useSeriesColors: false,
                },
            },
        },
    };

    return (
        <div className="rounded-lg p-4 bg-newCodes-foreground mb-6 overflow-hidden ">
            {/* Title */}
            <div className='flex items-start justify-between'>
                <h2 className="text-white text-left text-[18px] font-medium leading-[27px] mb-4">
                    Skill Gap Insights for {selectedPosition}
                </h2>

                <div className='mt-[-5px]'>
                    <CustomSelect
                        name="skillId"
                        label="Skill"
                        value={selectedPosition}
                        onChange={handleChange}
                        options={data?.map((item) => ({ name: item?.position, id: item?.position }))} // Example options for experience level
                        autoFocus={true}
                        size='small'
                    />
                </div>
            </div>

            {/* Bar Chart */}

            <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
            />

        </div>
    );
};

export default JobProfilePerformanceSkillsChart;