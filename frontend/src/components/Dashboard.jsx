import { useState } from "react";
import BinCards from "./binCard";

const Dashboard = ({ bins, updateBinFill, vehicles }) => {
  const [activeTab, setActiveTab] = useState("bins");

  return (
    <div className="mt-6 bg-white shadow rounded p-4">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab("bins")}
          className={`px-4 py-2 rounded-l ${
            activeTab === "bins"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Bins
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-r ${
            activeTab === "vehicles"
              ? "bg-teal-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Vehicles
        </button>
      </div>

      <div>
        {activeTab === "bins" ? (
          bins.length > 0 ? (
            <BinCards bins={bins} updateBinFill={updateBinFill} />
          ) : (
            <p className="text-center text-gray-500">No bins available.</p>
          )
        ) : vehicles.length > 0 ? (
          <div className="grid gap-4">
            {vehicles.map((v, idx) => (
              <div
                key={idx}
                className="border p-4 rounded shadow bg-gray-50"
              >
                <p className="font-semibold">Vehicle #{idx + 1}</p>
                <p>Capacity: {v.capacity}</p>
                <p>
                  Start Location: {v.startLocation?.lat.toFixed(4)}, {v.startLocation?.lng.toFixed(4)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No vehicles added.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;