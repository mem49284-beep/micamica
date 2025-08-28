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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-80 text-center">
        <h1 className="text-2xl font-bold mb-4">💰 Coin Counter</h1>

        {isLoading ? (
          <p className="text-4xl font-mono">...</p>
        ) : (
          <p className="text-6xl font-mono text-green-600">{coinCount}</p>
        )}

        <button
          onClick={resetCoins}
          disabled={isLoading}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Reset"}
        </button>
      </div>
    </div>
  );
}
