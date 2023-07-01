import React, { useState } from 'react';
import ThresholdedChart from "../components/dashboards/ThresholdedChart";

function Home() {
    const length = 16,
    maxValue = 16,
    minValue = 0,
    randomize = () => {
        return Array.from({ length: length }, () => Math.floor(Math.random() * maxValue) + 1);
    },
    [values, setValue] = useState(randomize()),
    [threshold, setThreshold] = useState( Math.floor(Math.random() * maxValue) + 1 );

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="h-[500px] w-full lg:w-[800px] flex justify-center items-center">
                <ThresholdedChart  values={values} threshold={threshold} />
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center">
                <label className="sm:mr-4">Threshold:</label>
                <input
                    type="number"
                    className="w-[150px] border border-gray-400 rounded-md px-4 py-2 sm:mr-4 mb-4 sm:mb-0"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    max={maxValue}
                    min={minValue} />

                <button
                    className="w-[150px] bg-[#ff6384] text-white px-4 py-2 rounded-md"
                    onClick={() => setValue(randomize())}
                >
                    Randomize
                </button>
            </div>
        </div>
    );
}

export default Home;