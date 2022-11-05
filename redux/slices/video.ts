import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Command } from "../../ai/command-processor";
import { xml2js, xml2json } from "xml-js";
import { originalXml } from "../../data/project";
import { ProjectObject, SequenceMedia } from "../../interfaces/project";
import { AppState } from "../store";

// First, create the thunk
export const updateVideo = createAsyncThunk(
  "videos/fetchByIdStatus",
  async (command: Command, thunkAPI) => {
    const response = await axios.post("", command); // TODO: url from env
    return response.data;
  }
);

enum VideoStatus {
  Rendering = "rendering",
  Ready = "Ready",
}

interface VideosState {
  status: VideoStatus;
  content: SequenceMedia;
  playedRatio: number;
  playedSeconds: number;
  isPlaying: boolean;
}

const originalProject = xml2js(originalXml, { compact: true }) as ProjectObject;
console.log(originalProject.xmeml.sequence.media);

const initialState = {
  status: VideoStatus.Ready,
  content: originalProject.xmeml.sequence.media,
  playedRatio: 0,
  playedSeconds: 0,
  isPlaying: false,
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
