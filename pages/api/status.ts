import type { NextApiRequest, NextApiResponse } from "next";
import { getProject } from "./controllers/projects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.json({ status: "Alles fasza" });
}
