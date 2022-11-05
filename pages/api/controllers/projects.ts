import { copyFile, readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { replaceEncodedText } from "../utils/encoding";
import { buildXml, getChild, parseXml } from "../utils/xml";
import { InMemoryVideoStore } from "./queue";

export interface EditorCommand {
  action: "replace";
  time: number;
  type: "text";
  value: string;
}

const PATH_TO_DATA = resolve("pages", "api", "data");
const PATH_TO_QUEUE = resolve("pages", "api", "data", "queue");

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
  switch (command.action) {
    case "replace":
      switch (command.type) {
        case "text":
          updatedProject = modifyText(parsedProject, command);
          break;
      }
      break;
    default:
      throw new Error("This command is not supported");
  }

  if (updatedProject) {
    const savedPath = await saveUpdatedProject(updatedProject, projectId);
    await generateVideo(savedPath, projectId);
  }

  return updatedProject;
}

export async function saveUpdatedProject(project: any, projectId: string) {
  const versionId = Date.now();
  const fileName = `${versionId}.xml`;
  const pathToXml = resolve(
    PATH_TO_DATA,
    "projects",
    projectId,
    'versions',
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
  name[0] = {'#text': updatedName}

  return project;
}

export async function generateVideo(xmlPath: string, projectId: string) {
  InMemoryVideoStore.setVideoStatus(projectId, 'rendering');
  return copyFile(xmlPath, PATH_TO_QUEUE + '/' + xmlPath.split('/').pop());
}

function modifyText(project: any, command: EditorCommand) {
  const xmeml = getChild("xmeml", project);
  const sequence = getChild("sequence", xmeml);
  const media = getChild("media", sequence);
  const video = getChild("video", media);
  const tracks = getChild("track", video);

  tracks.forEach((track: any) => {
    const clipItems = getChild("clipitem", track.track);

    clipItems?.forEach((clipItem: any) => {

      const filter = clipItem.clipitem ? getChild("filter", clipItem.clipitem): clipItem.filter;
      const effect = getChild("effect", filter);
      const parameters = getChild("parameter", effect);

      const textValueParameter = parameters?.find((parameter: any) => {
        const parameterId = getChild("parameterid", parameter.parameter);
        const id = getChild("#text", parameterId);

        return id === 1;
      });

      if (textValueParameter) {
        console.log(textValueParameter);
        const value = getChild("value", textValueParameter.parameter);
        const updatedValue = replaceEncodedText(value[0]['#text'], command.value, '');
        value[0] = {'#text': updatedValue}
        console.log('updated value', value);
      }
    });

  });

  return project;
}
