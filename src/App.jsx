"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [coinCount, setCoinCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const formatError = (err) => {
    if (err instanceof Error) return err.message;
    return typeof err === "string" ? err : JSON.stringify(err);
  };

  const fetchCoins = async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || "");
        throw new Error(`Server error ${res.status}${text ? `: ${text}` : ""}`);
      }

      const data = await res.json().catch(() => {
        throw new Error("Invalid JSON in response");
      });

      if (typeof data.coinCount !== "number") {
        throw new Error("Invalid response shape: expected { coinCount: number }");
      }

      setCoinCount(data.coinCount);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const resetCoins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/data", { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || "");
        throw new Error(`Reset failed ${res.status}${text ? `: ${text}` : ""}`);
      }

      setCoinCount(0);
      setError(null);
    } catch (err) {
      console.error("Reset error:", err);
      setError(formatError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    pollingRef.current = setInterval(fetchCoins, 2000);
    return () => clearInterval(pollingRef.current);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-bold">💰 Coin Counter</h1>

        {/* Error banner */}
        {error && (
          <div className="bg-red-800 px-4 py-2 rounded text-sm">
            <strong>Error:</strong> {error}
            <div className="mt-2">
              <button
                onClick={fetchCoins}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              >
                Retry
              </button>
            </div>
          </div>
        )}

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
            isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isLoading ? "Processing..." : "Reset"}
        </button>
      </div>
    </div>
  );
}
