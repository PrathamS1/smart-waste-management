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
    <div className="p-4 bg-white shadow rounded mb-4 w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-4 items-center p-16 shadow-2xl rounded-lg">
        <input
          type="number"
          min="1"
          value={vehicleCount}
          onChange={(e) => setVehicleCount(Number(e.target.value))}
          className="border px-3 py-2 rounded"
          placeholder="Number of Vehicles"
        />
        <input
          type="text"
          value={capacities}
          onChange={(e) => setCapacities(e.target.value)}
          className="border px-3 py-2 rounded"
          placeholder="Capacities (comma-separated)"
        />
        <button
          onClick={handleStartLocationClick}
          className={`px-4 py-2 font-[Poppins] rounded ${
            isSettingStart ? "bg-yellow-500" : "bg-teal-600 text-white"
          }`}
        >
          {isSettingStart ? "Click on Map..." : "Set Start Location"}
        </button>
        {startLocation && (
          <p className="font-[Lora] text-sm mt-2 text-gray-600">
            Start Location: {startLocation.lat}, {startLocation.lng}
          </p>
        )}
        <button
          onClick={handleAdd}
          className="font-[Poppins] bg-teal-700 text-white px-4 py-2 rounded shadow hover:bg-teal-800"
        >
          Add Vehicles
        </button>
        {error && (
          <p className="font-[Lora] text-red-500 text-sm mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default VehicleControlPanel;
