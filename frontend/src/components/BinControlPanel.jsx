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
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City Name"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Search
        </button>

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

        <button
          type="button"
          onClick={handleAdd}
          className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700"
        >
          Add Bins
        </button>
      </div>
    </form>
  );
};

export default BinControlPanel;
