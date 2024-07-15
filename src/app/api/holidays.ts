import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  // Handle GET request for holidays
  if (req.method === "GET") {
    const holidays = [
      { date: "2023-12-25", name: "Christmas" },
      { date: "2024-01-01", name: "New Year's Day" },
    ];
    res.status(200).json(holidays);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
