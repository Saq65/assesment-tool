import React from 'react';
import dynamic from 'next/dynamic';
import { colors } from '@mui/material';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const JobProfileChart = ({ data = [] }) => {
    console.log("data",data)

    const chartData = {
        series: [
            {
                name: 'Average Percentage',
                data: data.map((item) => parseFloat(item.averagePercentage)),
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
                    columnWidth: '18px',
                    
                },
            },
            dataLabels: {
                enabled: true,
                formatter: (val) => `${val}%`,
                offsetY: -10, // Adjust this value to fine-tune the vertical position of the labels
                style: {
                    fontSize: '6.9px',
                    colors: ['#94A3B8'],
                },
            },
            xaxis: {
                categories: data.map((item) => item.candidateJobPosition),
                labels: {
                    style: {
                        colors: '#fff',
                        fontSize: '8px',
                    },
                    rotate: -54,

                },
                axisBorder: {
                    color: '#fff',
                },
                axisTicks: {
                    show: false,
                },
            },
            yaxis: {
                title: {
                    text: '%',
                },
                max: 100,
                labels: {
                    style: {
                        fontSize: '11px',
                        colors: '#fff',
                        fontWeight:'700'
                    },
                    formatter: function (value) {
                        return Math.floor(value);
                    },
                    
                },
            },
            colors:['#1F51FF'],
            fill: {
                opacity: 5,
            },
            tooltip: {
                y: {
                    formatter: (val, { dataPointIndex }) => {
                        const fullName = data[dataPointIndex]?.candidateJobPosition;
                        return `${fullName}: ${val}%`;
                    },

                },
                theme: 'dark',
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
        <div className="rounded-lg  bg-newCodes-foreground mt-3  w-100">
            <h2 className="text-white text-left text-[18px] font-medium leading-[27px]">
                Job Opening Performance vs. Benchmark
            </h2>
            <div className='mt-4 w-100 items-center'>
                <Chart options={chartData.options} series={chartData.series} type="bar"  height={400} />
            </div>
        </div>
    );
};

export default JobProfileChart;