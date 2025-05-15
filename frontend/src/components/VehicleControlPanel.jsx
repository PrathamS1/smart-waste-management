import { useState } from "react";

const VehicleControlPanel = ({ onSetStartLocation, onAddVehicles }) => {
  const [vehicleCount, setVehicleCount] = useState(1);
  const [capacities, setCapacities] = useState("");
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleStartLocationClick = () => {
    setIsSettingStart(true);
    onSetStartLocation((location) => {
      setStartLocation(location);
      setIsSettingStart(false);
    });
  };

  const handleAdd = () => {
    const parsedCaps = capacities.split(",").map(Number);
    if (parsedCaps.length !== vehicleCount) {
      setError("Number of capacities must match vehicle count.");
      return;
    }

    if (!startLocation) {
      setError("Please set a start location on the map.");
      return;
    }

    const vehicles = Array.from({ length: vehicleCount }, (_, i) => ({
      id: i + 1,
      capacity: parsedCaps[i],
      startLocation,
    }));

    onAddVehicles(vehicles);
  };

  return (
    <div className="p-6">
      <div className="bg-gray-700/50 rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="vehicleCount" className="block text-sm font-medium text-gray-300 mb-2">
              Number of Vehicles
            </label>
            <input
              type="number"
              id="vehicleCount"
              min="1"
              value={vehicleCount}
              onChange={(e) => setVehicleCount(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter number of vehicles"
            />
          </div>

          <div>
            <label htmlFor="capacities" className="block text-sm font-medium text-gray-300 mb-2">
              Vehicle Capacities (comma-separated)
            </label>
            <input
              type="text"
              id="capacities"
              value={capacities}
              onChange={(e) => setCapacities(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all duration-200"
              placeholder="e.g., 1000, 1500, 2000"
            />
          </div>

          <button
            onClick={handleStartLocationClick}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isSettingStart
                ? "bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/30"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
            }`}
          >
            {isSettingStart ? "Click on Map..." : "Set Start Location"}
          </button>

          {startLocation && (
            <div className="p-3 bg-gray-600/50 rounded-lg">
              <p className="text-sm text-gray-300">
                Start Location: {startLocation.lat.toFixed(6)}, {startLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <button
            onClick={handleAdd}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-teal-500/30 transition-all duration-200 hover:scale-105"
          >
            Add Vehicles
          </button>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleControlPanel;
