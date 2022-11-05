import { replaceEncodedText } from "../utils/encoding";
import { overlapsIntervalFrames } from "../utils/time";
import { getChild } from "../utils/xml";
import { EditorCommand } from "./projects";

export function replaceText(project: any, command: EditorCommand) {
    let foundTextToReplace = false;

    const xmeml = getChild("xmeml", project);
    const sequence = getChild("sequence", xmeml);
    const media = getChild("media", sequence);
    const video = getChild("video", media);
  
    const tracks = getChild("track", video);
  
    tracks.forEach((track: any) => {
      const clipItems = getChild("clipitem", track.track, true);
      console.log("track", track);
      clipItems?.forEach((clipItem: any) => {
        const filters = getChild("filter", clipItem.clipitem, true);
        filters.forEach((filterItem: any) => {
          const filter = filterItem.filter;
          if (!filter) return;
  
          const start = getChild("#text", getChild("start", clipItem.clipitem));
          const end = getChild("#text", getChild("end", clipItem.clipitem));
  
          if (!overlapsIntervalFrames(start, end, command.time)) {
            console.log("Does not overlap filter");
            return;
          }
  
          const effect = getChild("effect", filter);
          const parameters = getChild("parameter", effect);
  
          const textValueParameter = parameters?.find((parameter: any) => {
            const parameterId = getChild("parameterid", parameter.parameter);
            const id = getChild("#text", parameterId);
  
            return id === 1;
          });
  
          if (textValueParameter) {
            console.log("Found text value");
            const value = getChild("value", textValueParameter.parameter);
            const updatedValue = replaceEncodedText(
              value[0]["#text"],
              command.value,
              ""
            );
            value[0] = { "#text": updatedValue };
            foundTextToReplace = true;
          }
        });
      });
    });
  
    return {project, replaced: foundTextToReplace};
  }
  