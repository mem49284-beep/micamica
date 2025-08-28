let total = 0;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { total: newTotal } = req.body || {};
    total = Number(newTotal) || total;  // replace with Arduino's total
    return res.status(200).json({ message: "Total updated", total });
  }

  if (req.method === "GET") {
    return res.status(200).json({ total });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
