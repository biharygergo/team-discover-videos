import { copyFile, readdir, readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { buildXml, getChild, parseXml } from "../utils/xml";
import { InMemoryVideoStore } from "./queue";
import { replaceText } from "./replaceText";
import { replaceVideo } from "./replaceVideo";
import { translateText } from "./translateText";

export interface EditorCommand {
  action: "replace" | "translate";
  time: number;
  type: "text" | "media";
  value: string;
}

export const PATH_TO_DATA = resolve("pages", "api", "data");
export const PATH_TO_QUEUE = resolve("pages", "api", "data", "queue");

export async function getLatestVersionId(projectId: string) {
  const versionPaths = await readdir(
    resolve(PATH_TO_DATA, "projects", projectId, "versions")
  );

  const lastVersionPath = versionPaths.pop();

  return lastVersionPath?.split('.')[0];
}

export async function getProject(projectId: string, versionId?: string) {
  const versionParts = versionId
    ? ["versions", `${versionId}.xml`]
    : ["original", "project.xml"];
  const pathToXml = resolve(
    PATH_TO_DATA,
    "projects",
    projectId,
    ...versionParts
  );
  const data = await readFile(pathToXml, { encoding: "utf-8" });
  const parsed = parseXml(data);

  return parsed;
}

export async function runCommand(
  command: EditorCommand,
  projectId: string,
  versionId?: string
) {
  const parsedProject = await getProject(projectId, versionId);
  let updatedProject = undefined;
  let success = false;

  switch (command.action) {
    case "replace":
      switch (command.type) {
        case "text":
          const result = replaceText(parsedProject, command);
          updatedProject = result.project;
          success = result.replaced;
          break;
        case "media":
          const videoResult = replaceVideo(parsedProject, command, projectId);
          updatedProject = videoResult.project;
          success = videoResult.foundVideoToReplace;
          break;
      }
      break;
    case "translate":
      const result = await translateText(parsedProject, command);
      updatedProject = result.project;
      success = result.replaced;
      break;
    default:
      throw new Error("This command is not supported");
  }

  if (success) {
    const savedPath = await saveUpdatedProject(updatedProject, projectId);
    await generateVideo(savedPath, projectId);
  }

  return { success, updatedProject };
}

export async function saveUpdatedProject(project: any, projectId: string) {
  const versionId = Date.now();
  const fileName = `${versionId}.xml`;
  const pathToXml = resolve(
    PATH_TO_DATA,
    "projects",
    projectId,
    "versions",
    fileName
  );

  setProjectName(project, `${projectId}@${versionId}`);
  await writeFile(pathToXml, buildXml(project));

  return pathToXml;
}

function setProjectName(project: any, updatedName: string) {
  const xmeml = getChild("xmeml", project);
  const sequence = getChild("sequence", xmeml);
  const name = getChild("name", sequence);
  name[0] = { "#text": updatedName };

  return project;
}

export async function generateVideo(xmlPath: string, projectId: string) {
  InMemoryVideoStore.setVideoStatus(projectId, "rendering");
  return copyFile(xmlPath, PATH_TO_QUEUE + "/" + xmlPath.split("/").pop());
}
