const BASE_URL = "http://localhost:5000";
function generateVehicleLicense(cityId, index) {
  const timestamp = Date.now().toString().slice(-5); // Last 5 digits of timestamp
  return `VEH-${cityId}-${timestamp}-${index}`;
}
export const fetchOptimizedRoute = async() => {
  try {
    const response = await fetch(`${BASE_URL}/api/test/build-graph`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch optimized route");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching optimized route:", error);
    throw error;
  }
}

export const sendOptimizationSetup = async ({
  bins,
  vehicles,
  startLocation,
}) => {
  try {
    const city_id = bins[0].city_id;
    const payload = {
      bins: bins.map((bin) => ({
        city_id: bin.city_id,
        bin_id: bin.id,
        latitude: bin.lat,
        longitude: bin.lng,
        capacity: 100,
        fill_percentage: bin.fill,
      })),
      vehicles: vehicles.map((vehicle, idx) => ({
        city_id: city_id,
        vehicle_license: generateVehicleLicense(city_id, idx + 1),
        load_capacity: vehicle.capacity,
        latitude: startLocation.lat,
        longitude: startLocation.lng,
        current_load: 0,
        assigned_bins: [],
        status: "available"
      })),
      start_location: {
        lat: startLocation.lat,
        lng: startLocation.lng,
      },
    };

    const response = await fetch(`${BASE_URL}/api/optimize/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending optimization setup:", error);
    throw error;
  }
};

export const fetchBinById = async (binId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/bins/id/${binId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch bin ${binId}`);
    }
    
    const data = await response.json();
    console.log("Response from fetchBinById:", data);
    return data;
  } catch (error) {
    console.error(`Error fetching bin ${binId}:`, error);
    throw error;
  }
};
