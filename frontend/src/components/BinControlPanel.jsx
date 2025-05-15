// src/components/BinControlPanel.jsx

import { useState } from "react";

const BinControlPanel = ({ onAddBins, onSearchCity }) => {
  const [count, setCount] = useState(5);
  const [fillMode, setFillMode] = useState("auto");
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearchCity(city);
    }
  };

  const handleAdd = () => {
    onAddBins(count, fillMode);
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* City Search */}
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City Name"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
          />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Bin Controls */}
        <div className="bg-gray-700/50 rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type="number"
                min="1"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
                placeholder="Number of Bins"
              />
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
              >
                <option value="auto" className="bg-gray-700">Auto Fill</option>
                <option value="manual" className="bg-gray-700">Manual Fill</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-teal-500/30 transition-all duration-200 hover:scale-105"
          >
            Add Bins
          </button>
        </div>
      </form>
    </div>
  );
};

export default BinControlPanel;
