import { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [total, setTotal] = useState(0);

  // ✅ Fetch total from API
  const fetchTotal = async () => {
    try {
      const res = await fetch("https://micamica.vercel.app/api/coin");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching total:", error);
    }
  };

  // ✅ Reset counter
  const resetTotal = async () => {
    try {
      const res = await fetch("https://micamica.vercel.app/api/coin", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to reset");
      const data = await res.json();
      setTotal(data.total);
    } catch (error) {
      console.error("Error resetting total:", error);
    }
  };

  useEffect(() => {
    fetchTotal();
    const interval = setInterval(fetchTotal, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Coin Counter</h1>
      <p className="counter-value">{total}</p>
      <button onClick={resetTotal}>Reset</button>
    </div>
  );
}
