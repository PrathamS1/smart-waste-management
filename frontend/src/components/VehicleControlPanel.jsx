import { useState } from 'react';

const VehicleControlPanel = ({ onSetStartLocation, onAddVehicles }) => {
  const [vehicleCount, setVehicleCount] = useState(1);
  const [capacities, setCapacities] = useState('');
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [startLocation, setStartLocation] = useState(null);

  const handleStartLocationClick = () => {
    setIsSettingStart(true);
    onSetStartLocation((location) => {
      setStartLocation(location);
      setIsSettingStart(false);
    });
  };

  const handleAdd = () => {
    const parsedCaps = capacities.split(',').map(Number);
    if (parsedCaps.length !== vehicleCount) {
      alert("Number of capacities must match vehicle count.");
      return;
    }

    if (!startLocation) {
      alert("Please set a start location on the map.");
      return;
    }

    const vehicles = Array.from({ length: vehicleCount }, (_, i) => ({
      id: i + 1,
      capacity: parsedCaps[i],
      startLocation
    }));

    onAddVehicles(vehicles);
  };

  return (
    <div className="p-4 bg-white shadow rounded mb-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
          className={`px-4 py-2 rounded ${
            isSettingStart ? 'bg-yellow-500' : 'bg-teal-600 text-white'
          }`}
        >
          {isSettingStart ? "Click on Map..." : "Set Start Location"}
        </button>
        <button
          onClick={handleAdd}
          className="bg-teal-700 text-white px-4 py-2 rounded shadow hover:bg-teal-800"
        >
          Add Vehicles
        </button>
      </div>
      {startLocation && (
        <p className="text-sm mt-2 text-gray-600">
          Start Location: {startLocation.lat}, {startLocation.lng}
        </p>
      )}
    </div>
  );
};

export default VehicleControlPanel;