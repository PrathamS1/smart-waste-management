// src/pages/BinPlacement.jsx

import { useState, useRef } from "react";
import BinMap from "../components/BinMap";
import BinControlPanel from "../components/BinControlPanel";
import BinCards from "../components/binCard";
import axios from "axios";
import VehicleControlPanel from "../components/VehicleControlPanel";
import Dashboard from "../components/Dashboard";

const BinPlacement = () => {
  const [startLocationCallback, setStartLocationCallback] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const handleSetStartLocation = (callback) => {
    setStartLocationCallback(() => callback);
  };

  const handleMapClick = (location) => {
    if (startLocationCallback) {
      startLocationCallback(location);
      setStartLocationCallback(null);
    }
  };
  const [bins, setBins] = useState([]);
  const [cityCenter, setCityCenter] = useState([28.6139, 77.209]); // Default: Delhi
  const mapRef = useRef();

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
  console.log("Vehicles Added: ", vehicles);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Smart Bin System</h1>

      <BinControlPanel
        onAddBins={handleAddBins}
        onSearchCity={handleSearchCity}
      />
      <VehicleControlPanel
        onSetStartLocation={handleSetStartLocation}
        onAddVehicles={(vehicles) => setVehicles(vehicles)}
      />

      <BinMap
        center={cityCenter}
        bins={bins}
        mapRef={mapRef}
        onMapClickForStart={handleMapClick}
      />

      {/* {bins.length > 0 && (
        <BinCards bins={bins} updateBinFill={updateBinFill} />
      )} */}
      <Dashboard bins={bins} updateBinFill={updateBinFill} vehicles={vehicles} />
    </div>
  );
};

export default BinPlacement;
