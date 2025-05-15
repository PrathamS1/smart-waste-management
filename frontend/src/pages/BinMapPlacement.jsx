import { useState, useRef } from "react";
import BinMap from "../components/BinMap";
import BinControlPanel from "../components/BinControlPanel";
import axios from "axios";
import VehicleControlPanel from "../components/VehicleControlPanel";
import Dashboard from "../components/Dashboard";
import RouteDetails from "../components/RouteDetails";
import LimitationsModal from "../components/LimitationsModal";
import { fetchOptimizedRoute, sendOptimizationSetup, fetchBinById } from "../utils/api";
import toast, { Toaster } from 'react-hot-toast';

const BinPlacement = () => {
  const [startLocationCallback, setStartLocationCallback] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [bins, setBins] = useState([]);
  const [cityCenter, setCityCenter] = useState([28.6139, 77.209]);
  const [activePanel, setActivePanel] = useState("bins");
  const [routes, setRoutes] = useState([]);
  const [routeBins, setRouteBins] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const mapRef = useRef();

  const fetchRouteBins = async (routeData) => {
    try {
      const orderedBinIds = routeData.flatMap(route => route.route_bin_ids);
      console.log("Ordered bin IDs:", orderedBinIds);

      const fetchedBins = [];
      for (const binId of orderedBinIds) {
        try {
          const binData = await fetchBinById(binId);
          console.log(`Fetched bin ${binId}:`, binData);
          fetchedBins.push(binData);
        } catch (error) {
          console.error(`Failed to fetch bin ${binId}:`, error);
        }
      }

      console.log("All fetched bins:", fetchedBins);
      setRouteBins(fetchedBins);
    } catch (error) {
      console.error("Error in fetchRouteBins:", error);
    }
  };

  const handleSetStartLocation = (callback) => {
    setStartLocationCallback(() => callback);
  };

  const fetchOptimizedRoutes = async () => {
    setIsSimulating(true);
    try {
      const res = await fetchOptimizedRoute();
      console.log("Raw optimized routes data:", res);
      
      if (res && res.routes) {
        console.log("Setting routes:", res.routes);
        setRoutes(res.routes);
        await fetchRouteBins(res.routes);
        toast.success("Simulation completed successfully!");
      } else {
        console.error("Invalid route data format:", res);
        toast.error("Failed to get optimized routes. Please try again.");
      }
    } catch (err) {
      console.error("Failed to fetch route data:", err);
      toast.error("Failed to run simulation. Please try again.");
    } finally {
      setIsSimulating(false);
    }
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
      toast.success("Data added successfully!");
    } catch (error) {
      console.error("Optimization setup failed:", error);
      toast.error("Failed to add data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section */}
          <div className="lg:w-[65%] bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-teal-400">Smart Waste Collection Map</h2>
            </div>
            <BinMap
              center={cityCenter}
              bins={bins}
              mapRef={mapRef}
              startLocation={setStartLocation}
              onMapClickForStart={handleMapClick}
              routes={routes}
              routeBins={routeBins}
              selectedRouteIndex={selectedRouteIndex}
            />
          </div>

          {/* Control Panel Section */}
          <div className="lg:w-[35%] space-y-6">
            {/* Panel Toggle */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-2xl">
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setActivePanel("bins")}
                  className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    activePanel === "bins"
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Bins
                </button>
                <button
                  onClick={() => setActivePanel("vehicles")}
                  className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                    activePanel === "vehicles"
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  Vehicles
                </button>
              </div>
            </div>

            {/* Control Panel Content */}
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
              {activePanel === "bins" ? (
                <BinControlPanel
                  onAddBins={handleAddBins}
                  onSearchCity={handleSearchCity}
                />
              ) : (
                <VehicleControlPanel
                  onSetStartLocation={handleSetStartLocation}
                  onAddVehicles={(vehicles) => setVehicles(vehicles)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="mt-6">
          <Dashboard
            bins={bins}
            updateBinFill={updateBinFill}
            vehicles={vehicles}
          />
        </div>

        {/* Route Details Section */}
        <div className="mt-6">
          <RouteDetails 
            routes={routes} 
            routeBins={routeBins}
            onRouteSelect={setSelectedRouteIndex}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleSimulationClick}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all duration-200 hover:scale-105"
          >
            Add Data
          </button>
          <button
            onClick={fetchOptimizedRoutes}
            disabled={isSimulating}
            className={`px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-200 hover:scale-105 flex items-center gap-2 ${
              isSimulating ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSimulating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Running Simulation...
              </>
            ) : (
              'Run Simulation'
            )}
          </button>
        </div>
      </div>
      <LimitationsModal />
    </div>
  );
};

export default BinPlacement;
