import React from "react";

const Dashboard = ({ bins, updateBinFill, vehicles }) => {
  // Calculate statistics
  const totalBins = bins.length;
  const totalVehicles = vehicles.length;
  const averageFill = bins.reduce((acc, bin) => acc + bin.fill, 0) / totalBins || 0;
  const binsNeedingCollection = bins.filter((bin) => bin.fill > 60).length;

  // Calculate vehicle statistics
  const totalCapacity = vehicles.reduce((acc, vehicle) => acc + vehicle.capacity, 0);
  const totalCurrentFill = vehicles.reduce((acc, vehicle) => acc + vehicle.currentFill, 0);
  const averageVehicleFill = (totalCurrentFill / totalCapacity) * 100 || 0;

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-teal-400 mb-6">System Dashboard</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Bins</p>
              <h3 className="text-2xl font-bold text-white">{totalBins}</h3>
            </div>
            <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Average Fill Level</p>
              <h3 className="text-2xl font-bold text-white">{averageFill.toFixed(1)}%</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Bins Needing Collection</p>
              <h3 className="text-2xl font-bold text-white">{binsNeedingCollection}</h3>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Vehicles</p>
              <h3 className="text-2xl font-bold text-white">{totalVehicles}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bins and Vehicles Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bins Section */}
        <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-teal-400 mb-4">Bin Status</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {bins.map((bin) => (
              <div key={bin.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">Bin {bin.id}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bin.fill > 70 ? 'bg-red-500/20 text-red-400' :
                    bin.fill > 40 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {bin.fill}% Full
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${
                      bin.fill > 70 ? 'bg-red-500' :
                      bin.fill > 40 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${bin.fill}%` }}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={bin.fill}
                    onChange={(e) => updateBinFill(bin.id, parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-400">{bin.fill}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
          <h3 className="text-xl font-semibold text-teal-400 mb-4">Vehicle Status</h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {vehicles.map((vehicle, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">Vehicle {index + 1}</h4>
                  <span className="text-sm text-gray-400">{vehicle.license}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-400">Capacity</p>
                    <p className="text-white font-medium">{vehicle.capacity} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Fill</p>
                    <p className="text-white font-medium">{vehicle.currentFill} units</p>
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: `${(vehicle.currentFill / vehicle.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;