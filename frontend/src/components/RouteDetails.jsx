import React from 'react';

const RouteDetails = ({ routes, routeBins }) => {
  console.log("Route bins:", routeBins);
  console.log("Routes:", routes);
  if (!routes || routes.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-gray-700/50 rounded-lg p-6 text-center">
          <p className="text-gray-400">No routes available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {routes.map((route, index) => (
          <div
            key={index}
            className="bg-gray-700/50 rounded-lg p-6 transition-all duration-200 hover:bg-gray-700/70"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-teal-400">Route {index + 1}</h3>
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-sm">
                Vehicle {route.vehicle_id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-gray-300">Total Distance:</span>
                  <span className="text-white font-medium">
                    {((route.total_distance) / 1000).toFixed(2)} km
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <span className="text-gray-300">Collected Fill:</span>
                  <span className="text-white font-medium">
                    {route.collected_fill.toFixed(2)} kg
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="text-gray-300">License:</span>
                  <span className="text-white font-medium">{route.license}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-300">Bins:</span>
                  <span className="text-white font-medium">
                    {route.route_bin_ids.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Bin Sequence:</h4>
              {/* <div className="flex flex-wrap gap-2">
                {route.route_bin_ids.map((binId, binIndex) => (
                  <span
                    key={binId}
                    className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-sm"
                  >
                    Bin {binId}
                  </span>
                ))}
              </div> */}
              <div className="flex flex-wrap gap-2">
                {route.route_bin_ids.map((binId, binIndex) => {
                  const binData = routeBins[binIndex]; // Get the bin at the current index
                  return (
                    <span
                      key={binId}
                      className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-sm"
                    >
                      Bin ID: {binData?.bin_id ?? "N/A"} (Index: {binIndex})
                    </span>
                  );
                })}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDetails; 