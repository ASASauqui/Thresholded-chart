import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ values, threshold }) => {
    const chartRef = useRef(null),
    getCutPoint = (x1, y1, x2, y2, y) => {
        // m = (y2 - y1) / (x2 - x1)
        const m = (y2 - y1) / (x2 - x1);

        // b = y1 - m * x1
        const b = y1 - m * x1;

        // Equation: y = m*x + b => x = (y - b) / m
        const x = (y - b) / m;

        return x;
    },
    thresholdPlugin = {
        id: 'threshold',
        beforeDraw: (chart) => {
            // Get the context of the canvas, chart area, scales, and metadatasets.
            const { ctx, chartArea, scales: { y }, _metasets } = chart;

            // If the metadataset is hidden.
            if (_metasets[0].hidden) {
                return;
            }

            // Get data from the metadatasets.
            const metasets = _metasets[0].data;

            // Get current threshold value.
            const thresholdValue = chart.options.plugins.threshold.value;

            // If the threshold value is less than the minimum value of min number in the y axis.
            if (thresholdValue < y.min) {
                return;
            }

            // Get threshold value in pixels.
            const thresholdY = y.getPixelForValue(thresholdValue);

            // Save the canvas context.
            ctx.save();

            // Begin the path.
            ctx.beginPath();

            // Draw the contour of the line.
            for (let i = 0; i < metasets.length; i++) {
                // Get the point.
                const point = metasets[i];
                const x = point.x;
                const y = point.y;

                // If it is the first point.
                if (i === 0) {
                    if (y <= thresholdY) {
                        ctx.moveTo(x, thresholdY);
                    }
                    else {
                        ctx.moveTo(x, y);
                    }
                }
                // If is not the first point.
                else {
                    // Get the previous point.
                    const prevPoint = metasets[i - 1];
                    const prevX = prevPoint.x;
                    const prevY = prevPoint.y;

                    if (y <= thresholdY) {
                        const x1 = getCutPoint(prevX, prevY, x, y, thresholdY);
                        const y1 = thresholdY;

                        ctx.lineTo(x1, y1);
                    }
                    else {
                        const x1 = getCutPoint(prevX, prevY, x, y, thresholdY);
                        const y1 = thresholdY;

                        ctx.lineTo(x1, y1);
                        ctx.lineTo(x, y);
                    }
                }
            }

            // Close the path.
            ctx.lineTo(chartArea.right, thresholdY);
            ctx.lineTo(chartArea.right, chartArea.bottom);
            ctx.lineTo(chartArea.left, chartArea.bottom);
            ctx.lineTo(chartArea.left, thresholdY);
            ctx.closePath();

            // Clip the path.
            ctx.clip();

            // Fill the path.
            ctx.fillStyle = chart.options.plugins.threshold.fillColor;
            ctx.fill();

            // Restore the canvas context.
            ctx.restore();
        },
    };

    Chart.register(thresholdPlugin);

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
                    },
                ],
            },
            options: {
                plugins: {
                    threshold: {
                        value: threshold,
                        fillColor: '#e7cace99',
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
