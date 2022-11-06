import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Command } from "../../ai/command-processor";
import { xml2js, xml2json } from "xml-js";
import { originalXml } from "../../data/project";
import {
  ProjectObject,
  Sequence,
  SequenceMedia,
} from "../../interfaces/project";
import { AppState } from "../store";
import { BACKEND_URL } from "../../config";

// First, create the thunk
export const updateVideo = createAsyncThunk(
  "videos/updateVideo",
  async (command: Command, thunkAPI) => {
    const projectId = (thunkAPI.getState() as AppState).videos.projectId;
    const response = await axios.put(
      `${BACKEND_URL}/api/projects/${projectId}`,
      command,
      {
        headers: { "ngrok-skip-browser-warning": "69420" },
      }
    ); // TODO: url from env
    return response.data;
  }
);

export const getVideo = createAsyncThunk(
  "videos/getVideo",
  async (projectId: string, thunkAPI) => {
    console.log('getVideo', projectId);
    
    // const projectId = (thunkAPI.getState() as AppState).videos.projectId;
    const response = await axios.get(
      `${BACKEND_URL}/api/projects/${projectId}`,
      {
        headers: { "ngrok-skip-browser-warning": "69420" },
      }
    ); // TODO: url from env
    return response.data;
  }
);


export const pollVideo = createAsyncThunk(
  "videos/pollVideo",
  async (_, thunkAPI) => {
    const projectId = (thunkAPI.getState() as AppState).videos.projectId;
    const response = await axios.get(
      `${BACKEND_URL}/api/projects/${projectId}/video`,
      {
        headers: { "ngrok-skip-browser-warning": "69420" },
      }
    );

    return response.data;
  }
);

enum VideoStatus {
  Rendering = "rendering",
  Done = "done",
}

interface VideosState {
  path: string | null;
  status: VideoStatus;
  content: Sequence | null;
  playedRatio: number;
  playedSeconds: number;
  isPlaying: boolean;
  projectId: string | null;
}

const originalProject = xml2js(originalXml, { compact: true }) as ProjectObject;

const initialState = {
  status: VideoStatus.Done,
  content: null,
  playedRatio: 0,
  playedSeconds: 0,
  isPlaying: false,
  projectId: null, // TODO: put this to slug
} as VideosState;

// Then, handle actions in your reducers:
export const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setProjectId: (state, action: PayloadAction<{ projectId: string }>) => {
      state.projectId = action.payload.projectId;
    },
    startVideo: (state) => {
      console.log("startVideo");

      state.isPlaying = true;
    },
    stopVideo: (state) => {
      console.log("stopVideo");
      state.isPlaying = false;
    },
    updateProgress: (
      state,
      action: PayloadAction<{ playedRatio: number; playedSeconds?: number }>
    ) => {
      state.playedRatio = action.payload.playedRatio;

      console.log("updateProgress", action.payload.playedRatio);

      if (action.payload.playedSeconds) {
        state.playedSeconds = action.payload.playedSeconds;
      }
    },
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(updateVideo.fulfilled, (state, action) => {
      // Add video to the state array
      if (action.payload.success === true) {
        const updatedProject = xml2js(action.payload.updatedProject, {
          compact: true,
        }) as ProjectObject;
        state.content = updatedProject.xmeml.sequence;
      }
    });

    builder.addCase(getVideo.fulfilled, (state, action) => {
      // Add video to the state array
        const project = xml2js(action.payload.project, {
          compact: true,
        }) as ProjectObject;
        state.content = project.xmeml.sequence;
      });
    

    builder.addCase(pollVideo.fulfilled, (state, action) => {
      state.status = action.payload.status;
      state.path = action.payload.latestFile;
    });
  },
});

export const { updateProgress, startVideo, stopVideo, setProjectId } =
  videosSlice.actions;

export const selectMedia = (state: AppState) => state.videos.content;
export const selectIsPlaying = (state: AppState) => state.videos.isPlaying;
export const selectPlayedRatio = (state: AppState) => state.videos.playedRatio;
export const selectPath = (state: AppState) => state.videos.path;
export const selectVideoStatus = (state: AppState) => state.videos.status;
