import { join } from "path";
import { overlapsIntervalFrames } from "../utils/time";
import { getChild } from "../utils/xml";
import { EditorCommand, PATH_TO_DATA } from "./projects";

export function replaceVideo(project: any, command: EditorCommand, projectId: string) {
    let foundVideoToReplace = false;
    const xmeml = getChild("xmeml", project);
    const sequence = getChild("sequence", xmeml);
    const media = getChild("media", sequence);
    const video = getChild("video", media);
  
    const tracks = getChild("track", video);
    const videoTrack = tracks[0].track;
  
    console.log("video track", videoTrack);
  
    const clipItems = getChild("clipitem", videoTrack, true);
    clipItems?.forEach((clipItem: any) => {
      const file = getChild("file", clipItem.clipitem);
      if (!file) return;
  
      const start = getChild("#text", getChild("start", clipItem.clipitem));
      const end = getChild("#text", getChild("end", clipItem.clipitem));
  
      console.log(start, end);
  
      if (!overlapsIntervalFrames(start, end, command.time)) {
        console.log("Does not overlap filter");
        return;
      }
  
      console.log("FOUND OVERLAP");
      foundVideoToReplace = true;
      const name = getChild("name", clipItem.clipitem);
      console.log("root name", name);
      name[0] = { "#text": command.value };
  
      const fileName = getChild("name", file);
      console.log("name in file", fileName);
      fileName[0] = { "#text": command.value };
  
      const filePath = getChild("pathurl", file);
      console.log("path in file", filePath);
  
      const pathToAssets =
        "file://localhost" +
        join(PATH_TO_DATA, "assets", "videos", `${command.value}.mp4`);
      console.log("new path", pathToAssets);
      filePath[0] = { "#text": pathToAssets };
    });
  
    return {project, foundVideoToReplace};
  }