import React, { useState } from 'react';
import { Link } from "react-router-dom";

const LimitationsModal = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const limitations = [
    {
      title: "Map Interaction",
      items: [
        "Refrain from tapping on the map as it will add unnecessary marker.",
        "Map markers cannot be dragged after placement",
        "Limited to one start location per simulation"
      ]
    },
    {
      title: "Bin Management",
      items: [
        "The number of bins will affect the performance of the simulation i.e. taking more time to generate routes.",
        "Bin fill level must be between 0-100%",
        "Bins cannot be deleted once added"
      ]
    },
    {
      title: "Vehicle Constraints",
      items: [
        "The number of vehicles will affect the performance of the simulation i.e. taking more time to generate routes.",
        "The number of vehicles does not mean the number of routes generated.",
        "Vehicle capacity must be between 100-1000 units",
        "Start location must be set before adding vehicles"
      ]
    },
    {
      title: "Route Optimization",
      items: [
        "Routes are optimized based on bin fill levels",
        "Routes cannot be manually modified after generation",
        "The number of bins in a route will affect the performance of the simulation i.e. taking more time to generate routes.",
        "Clicking on the map will add a marker to the map which will change the start location of the route but it will not be considered for the route generation and distance calculation."
      ]
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-100">
      {/* Collapsed Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-zinc-800 text-white p-3 rounded-full border-2 border-red-500 shadow-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
      >
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span className="text-sm">Important Points</span>
      </button>

      {/* Expanded Modal */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 z-100 w-xl bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 overflow-hidden">
          <div className="p-4 border-b border-zinc-700 bg-red-100 flex flex-col items-center">
            <Link to="/how-it-works"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow transition-colors text-center w-full"
            >
              Server is not deployed so the simulation will not work,<br/>see <span className="underline">How it works</span> to gain insight
            </Link>
          </div>
          <div className="p-4 border-b border-zinc-700">
            <h3 className="text-lg font-semibold text-teal-400">System Limitations</h3>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {limitations.map((section, index) => (
              <div key={index} className="p-4 border-b border-zinc-700 last:border-b-0">
                <h4 className="text-sm font-medium text-zinc-300 mb-2">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm text-zinc-400">
                      <svg
                        className="w-4 h-4 text-teal-400 mt-1 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LimitationsModal; 