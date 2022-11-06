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
  "videos/fetchByIdStatus",
  async (command: Command, thunkAPI) => {
    const projectId = (thunkAPI.getState() as AppState).videos.projectId;
    const response = await axios.post(`${BACKEND_URL}/api/${projectId}`, command, {
      headers: { "ngrok-skip-browser-warning": "69420" },
    }); // TODO: url from env
    return response.data;
  }
);

enum VideoStatus {
  Rendering = "rendering",
  Ready = "Ready",
}

interface VideosState {
  status: VideoStatus;
  content: Sequence;
  playedRatio: number;
  playedSeconds: number;
  isPlaying: boolean;
  projectId: string | null;
}

const originalProject = xml2js(originalXml, { compact: true }) as ProjectObject;

const initialState = {
  status: VideoStatus.Ready,
  content: originalProject.xmeml.sequence,
  playedRatio: 0,
  playedSeconds: 0,
  isPlaying: false,
  projectId: 'final_project' // TODO: put this to slug
} as VideosState;

// Then, handle actions in your reducers:
export const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    startVideo: (state) => {
      console.log("startVideo");

      state.isPlaying = true;
    },
    stopVideo: (state) => {
      state.isPlaying = false;
    },
    updateProgress: (
      state,
      action: PayloadAction<{ playedRatio: number; playedSeconds?: number }>
    ) => {
      state.playedRatio = action.payload.playedRatio;

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
      state.content = action.payload;
    });
  },
});

export const { updateProgress, startVideo, stopVideo } = videosSlice.actions;

export const selectMedia = (state: AppState) => state.videos.content;
export const selectIsPlaying = (state: AppState) => state.videos.isPlaying;
export const selectPlayedRatio = (state: AppState) => state.videos.playedRatio;
