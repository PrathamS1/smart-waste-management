import { useState, useRef } from "react";
import BinMap from "../components/BinMap";
import BinControlPanel from "../components/BinControlPanel";
import axios from "axios";
import VehicleControlPanel from "../components/VehicleControlPanel";
import Dashboard from "../components/Dashboard";
import { sendOptimizationSetup } from "../utils/api";

const BinPlacement = () => {
  const [startLocationCallback, setStartLocationCallback] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [bins, setBins] = useState([]);
  const [cityCenter, setCityCenter] = useState([28.6139, 77.209]);
  const [activePanel, setActivePanel] = useState("bins");

  const mapRef = useRef();
  const handleSetStartLocation = (callback) => {
    setStartLocationCallback(() => callback);
  };

  const handleMapClick = (location) => {
    if (startLocationCallback) {
      startLocationCallback(location);
      setStartLocationCallback(null);
    }
  };
  const handleSearchCity = async (cityName) => {
    try {
      const res = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: cityName,
            format: "json",
            limit: 1,
          },
        }
      );
      console.log("Search response for", cityName, res.data);

      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        setCityCenter(newCenter);

        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.setView(newCenter, 13);
          }
        }, 100);
      } else {
        alert("City not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch city location.");
    }
  };

  const handleAddBins = (num, fillMode) => {
    const bounds = {
      minLat: cityCenter[0] - 0.02,
      maxLat: cityCenter[0] + 0.02,
      minLng: cityCenter[1] - 0.02,
      maxLng: cityCenter[1] + 0.02,
    };

    const newBins = Array.from({ length: num }, (_, i) => ({
      city_id: cityCenter,
      id: bins.length + i + 1,
      lat: parseFloat(
        (
          Math.random() * (bounds.maxLat - bounds.minLat) +
          bounds.minLat
        ).toFixed(6)
      ),
      lng: parseFloat(
        (
          Math.random() * (bounds.maxLng - bounds.minLng) +
          bounds.minLng
        ).toFixed(6)
      ),
      fill: fillMode === "auto" ? Math.floor(Math.random() * 101) : 0,
    }));

    setBins([...bins, ...newBins]);
  };

  const updateBinFill = (id, newFill) => {
    const updated = bins.map((bin) =>
      bin.id === id ? { ...bin, fill: newFill } : bin
    );
    setBins(updated);
  };
  const handleSimulationClick = async () => {
    try {
      const response = await sendOptimizationSetup({
        bins,
        vehicles,
        startLocation,
      });
      console.log("Server response:", response);
    } catch (error) {
      console.error("Optimization setup failed:", error);
    }
  };
  console.log("Vehicles Added: ", vehicles);
  console.log("Bins added: ", bins);
  console.log("Start Location in Bin Placement: ", startLocation);
  return (
    <div className="p-4">
      <div className="flex flex-row justify-between mb-4 w-full">
        <div className="w-[60%]">
          <BinMap
            center={cityCenter}
            bins={bins}
            mapRef={mapRef}
            startLocation={setStartLocation}
            onMapClickForStart={handleMapClick}
          />
        </div>
        <div className="w-[40%] flex flex-col justify-between items-center">
          <div className="flex gap-3 mt-2 mb-2">
            <button
              onClick={() => setActivePanel("bins")}
              className={`hover:cursor-pointer text-[1.5rem] font-[Poppins] rounded-md px-4 shadow-lg ${
                activePanel === "bins"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Bins
            </button>
            <button
              onClick={() => setActivePanel("vehicles")}
              className={`hover:cursor-pointer text-[1.5rem] font-[Poppins] rounded-md px-4 shadow-lg ${
                activePanel === "vehicles"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Vehicles
            </button>
          </div>

          {activePanel === "bins" && (
            <BinControlPanel
              onAddBins={handleAddBins}
              onSearchCity={handleSearchCity}
            />
          )}
          {activePanel === "vehicles" && (
            <VehicleControlPanel
              onSetStartLocation={handleSetStartLocation}
              onAddVehicles={(vehicles) => setVehicles(vehicles)}
            />
          )}
        </div>
      </div>
      <Dashboard
        bins={bins}
        updateBinFill={updateBinFill}
        vehicles={vehicles}
      />
      <div className="simulation-button-container mt-4 h-20 flex justify-center">
        <button
          onClick={handleSimulationClick}
          className="w-fit pr-4 pl-4 h-12 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
        >
          Start Simulation
        </button>
      </div>
    </div>
  );
};

export default BinPlacement;
