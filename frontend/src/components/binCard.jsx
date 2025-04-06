import React from 'react';

const BinCards = ({ bins, updateBinFill }) => {
  return (
    <div className="bin-cards-container">
      <h2 className="text-xl font-bold mb-4">Bin Fill Levels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bins.map((bin) => (
          <div
            key={bin.id}
            className="p-4 rounded-lg shadow-md bg-white border border-gray-200"
          >
            <p className="font-semibold mb-2">Bin #{bin.id}</p>
            <p className="text-sm text-gray-600 mb-2">
              Lat: {bin.lat.toFixed(4)} | Lng: {bin.lng.toFixed(4)}
            </p>
            <input
              type="range"
              min="0"
              max="100"
              value={bin.fill}
              onChange={(e) => updateBinFill(bin.id, parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-sm mt-1">Fill: {bin.fill}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinCards;