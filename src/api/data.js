// pages/api/coin.js

let total = 0; // stores coins (resets on server restart)

export default function handler(req, res) {
  if (req.method === "GET") {
    // ✅ Get current total
    res.status(200).json({ total });
  } 
  
  else if (req.method === "POST") {
    // ✅ Add coin (Arduino sends { value: 1 })
    const { value } = req.body || {};
    if (typeof value !== "number") {
      return res.status(400).json({ error: "Invalid coin value" });
    }
    total += value;
    res.status(200).json({ total });
  } 
  
  else if (req.method === "DELETE") {
    // ✅ Reset to 0
    total = 0;
    res.status(200).json({ total });
  } 
  
  else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
