import { configureStore, ThunkAction, Action  } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { commentsSlice } from "./slices/comments";
import { videosSlice } from "./slices/video";
import { assetsSlice } from "./slices/assets";
import { useDispatch } from 'react-redux'

export function makeStore() {
  return configureStore({
    reducer: {
      comments: commentsSlice.reducer,
      videos: videosSlice.reducer,
      assets: assetsSlice.reducer,
    },
  });
}

const store = makeStore();

export default store;
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types
