import type { NextApiRequest, NextApiResponse } from "next";
import { createSandboxProject } from "../controllers/projects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Used for sandbox
  const projectId = await createSandboxProject();
  return res.send({projectId});
}
