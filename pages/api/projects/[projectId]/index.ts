import type { NextApiRequest, NextApiResponse } from "next";
import {
  getLatestVersionId,
  getProject,
  runCommand,
} from "../../controllers/projects";
import { initializeQueue } from "../../controllers/queue";
import { buildXml } from "../../utils/xml";

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
  let versionId = req.query.versionId as string | undefined;

  // Default to the latest version
  if (!versionId) {
    versionId = await getLatestVersionId(projectId);
    console.log("FOUND VERSION", versionId);
  }

  // Reset version ID if original is explicitly requested
  if (versionId === "original") {
    versionId = undefined;
  }

  if (req.method === "GET") {
    try {
      const projectData = await getProject(projectId, versionId);
      return res.send({ project: buildXml(projectData) });
    } catch (e) {
      console.error(e);
      return res.json({
        error: `Something went wrong, the error is: ${(e as any).message}`,
      });
    }
  } else if (req.method === "PUT") {
    const command = req.body;
    const result = await runCommand(command, projectId, versionId);
    return res.send({
      updatedProject: buildXml(result.updatedProject),
      success: result.success,
    });
  } else {
    return res.json({ error: "Method not supported" });
  }
}
