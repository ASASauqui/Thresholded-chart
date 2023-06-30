import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ values, threshold }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const thresholdPlugin = {
            id: 'threshold',
            beforeDraw: (chart) => {
                // Get the context of the canvas, area of the chart, scales, and metadatasets.
                // const { ctx, chartArea, scales: { y }, _metasets } = chart;

                // Get data from the metadatasets.
                // const metasets = _metasets[0].data;

                // Get threshold value in pixels.
                // const thresholdY = y.getPixelForValue(threshold);
            },
        };

        Chart.register(thresholdPlugin);

    }, [values, threshold]);


    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        let chartInstance = null;

        if (chartRef.current && chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: values.map((_, index) => index + 1),
                datasets: [
                    {
                        label: 'Demo thresholded chart',
                        data: values,
                        borderWidth: 2,
                        borderColor: '#ff6384',
                        backgroundColor: 'transparent',
                        fill: {value: threshold, above: '#e7cace99', below: '#e7cace99'},
                    },
                ],
            },
            options: {
                plugins: {
                    threshold: {
                        value: threshold,
                        above: '#e7cace99',
                        below: '#e7cace99',
                    },
                },
            },
        });

        chartRef.current.chart = chartInstance;

        return () => {
            chartInstance.destroy();
        };
    }, [values, threshold]);

    return <canvas ref={chartRef} />;
};

export default ChartComponent;
