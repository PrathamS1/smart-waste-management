import React from "react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-center py-12 px-4">
      <h2 className="text-4xl font-bold mb-8 text-blue-700 drop-shadow-lg">How It Works</h2>
      <div className="relative flex items-center justify-center w-full max-w-3xl">
        {/* Ambience effect */}
        <div className="absolute -inset-6 rounded-3xl blur-2xl opacity-60 bg-gradient-to-r from-blue-300 via-purple-200 to-pink-200 z-0 animate-pulse"></div>
        <iframe
          className="relative z-10 rounded-3xl shadow-2xl border-4 border-white w-full max-w-3xl aspect-video"
          src="https://www.youtube.com/embed/k5xZOYG3wCI"
          title="How It Works"
          style={{border: 0}}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default HowItWorks; 