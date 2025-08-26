"use client";
import { useState, useEffect } from "react";

export default function App() {
  const [coinCount, setCoinCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoins = async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      const data = await res.json();
      setCoinCount(data.coinCount);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCoins = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/data", { method: "DELETE" });
      setCoinCount(0);
    } catch (err) {
      console.error("Reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-indigo-800 to-gray-900 text-white">
      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-12 flex flex-col items-center space-y-10 border border-white/20">
        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-md">
          💰 Coin Counter
        </h1>

        {/* Value */}
        {isLoading ? (
          <div className="text-7xl font-extrabold text-yellow-400 animate-pulse">
            ...
          </div>
        ) : (
          <div className="text-7xl font-extrabold text-yellow-400 drop-shadow-lg">
            {coinCount}
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={resetCoins}
          disabled={isLoading}
          className={`px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400/50 ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-black"
          }`}
        >
          {isLoading ? "Processing..." : "Reset"}
        </button>
      </div>
    </div>
  );
}
