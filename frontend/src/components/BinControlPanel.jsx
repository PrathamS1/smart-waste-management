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
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded mb-4 w-[100%] h-[100%]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter City Name"
            className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-80 transition-all focus:w-74 outline-none"
          />
          <button type="submit">
            <svg
              class="size-6 absolute top-3 right-3 text-gray-500"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                stroke-linejoin="round"
                stroke-linecap="round"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center p-4 shadow-2xl h-56 rounded-b-lg">
          <div className="flex gap-4 items-center">
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="border rounded px-3 py-2"
              placeholder="Number of Bins"
            />
            <select
              value={fillMode}
              onChange={(e) => setFillMode(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="auto">Auto Fill</option>
              <option value="manual">Manual Fill</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700"
          >
            Add Bins
          </button>
        </div>
      </div>
    </form>
  );
};

export default BinControlPanel;
