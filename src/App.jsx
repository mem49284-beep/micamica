"use client";
import { useState, useEffect } from "react";

export default function Home() {
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
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-bold">💰 Coin Counter</h1>

        {/* Value */}
        {isLoading ? (
          <div className="text-8xl font-extrabold text-blue-500 animate-pulse">...</div>
        ) : (
          <h2 className="text-8xl font-extrabold text-blue-500">{coinCount}</h2>
        )}

        {/* Reset Button */}
        <button
          onClick={resetCoins}
          disabled={isLoading}
          className={`px-8 py-3 rounded-2xl shadow-lg text-lg font-semibold transition-all duration-200 ${
            isLoading ? "bg-gray-600" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Processing..." : "Reset"}
        </button>
      </div>
    </div>
  );
}
