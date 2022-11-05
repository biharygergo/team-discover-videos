import type { NextApiRequest, NextApiResponse } from "next";
import { getProject, runCommand } from "../../controllers/projects";
import { initializeQueue } from "../../controllers/queue";

let isWatcherStarted = false;
if (!isWatcherStarted) {
  initializeQueue();
  isWatcherStarted = true;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectId = req.query.projectId as string;
  const versionId = req.query.versionId as string | undefined;
  if (req.method === "GET") {
    try {
      const projectData = await getProject(projectId, versionId);
      return res.send(projectData);
    } catch (e) {
      console.error(e);
      return res.json({
        error: `Something went wrong, the error is: ${(e as any).message}`,
      });
    }
  } else if (req.method === "PUT") {
    const command = req.body;
    const updatedProject = await runCommand(command, projectId, versionId);
    return res.send(updatedProject);
    
  } else {
    return res.json({ error: "Method not supported" });
  }
}
