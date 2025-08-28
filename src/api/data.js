let coinCount = 0; // store coin count in memory (resets on redeploy)

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { coinCount: newCoins } = req.body;

      if (typeof newCoins !== "number") {
        return res.status(400).json({ error: "coinCount must be a number" });
      }

      coinCount += newCoins; // update count
      console.log("Received coin count:", newCoins, " Total:", coinCount);

      return res.status(200).json({ message: "Coin count updated", total: coinCount });
    } catch (error) {
      return res.status(500).json({ error: "Error processing request" });
    }
  } 
  
  else if (req.method === 'GET') {
    return res.status(200).json({ total: coinCount });
  } 
  
  else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}