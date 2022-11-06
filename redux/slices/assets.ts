import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Command } from "../../ai/command-processor";
import { AppState } from "../store";
import _ from "lodash-es";
import { BACKEND_URL } from "../../config";

export const fetchAssets = createAsyncThunk("assets/fetchAll", async () => {
  const response = await axios.get(`${BACKEND_URL}/api/assets`, {headers: {"ngrok-skip-browser-warning": "69420"}});
  return response.data;
});

enum AssetType {
  Video = "video",
  Audio = "audio",
}

export interface Assett {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: AssetType;
}

interface AssetsState {
  byId: Record<string, Assett>;
}

const initialState = {
  byId: _.keyBy([
    {
      id: "brainstorming",
      videoUrl: "/api/assets/videos/brainstorming",
      thumbnailUrl: "/api/assets/thumbnails/brainstorming",
      type: "video",
    },
    {
      id: "coding",
      videoUrl: "/api/assets/videos/coding",
      thumbnailUrl: "/api/assets/thumbnails/coding",
      type: "video",
    },
    {
      id: "hacker",
      videoUrl: "/api/assets/videos/hacker",
      thumbnailUrl: "/api/assets/thumbnails/hacker",
      type: "video",
    },
    {
      id: "matrix",
      videoUrl: "/api/assets/videos/matrix",
      thumbnailUrl: "/api/assets/thumbnails/matrix",
      type: "video",
    },
    {
      id: "thinking",
      videoUrl: "/api/assets/videos/thinking",
      thumbnailUrl: "/api/assets/thumbnails/thinking",
      type: "video",
    },
  ], 'id'),
} as AssetsState;

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      state.byId = _.keyBy(action.payload, "id");
    });
  },
});

export const {} = assetsSlice.actions;

export const selectAssets = (state: AppState) => state.assets.byId;
export const selectAssetById = (id: string) => (state: AppState) =>
  state.assets.byId[id];
