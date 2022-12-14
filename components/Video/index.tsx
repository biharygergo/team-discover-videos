import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { AppState, useAppDispatch } from "../../redux/store";
import {
  selectIsPlaying,
  selectPath,
  selectPlayedRatio,
  startVideo,
  stopVideo,
  updateProgress,
} from "../../redux/slices/video";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import { BACKEND_URL } from "../../config";
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface Props {}

export const Video = (props: Props) => {
  const dispatch = useAppDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const playedRatio = useSelector(selectPlayedRatio);
  const path = useSelector(selectPath);
  const projectId = useSelector((state: AppState) => state.videos.projectId);
  const videoRef = useRef(null);

  const getPlayedRatio = () => {
    if (videoRef.current) {
      return (
        (videoRef.current as any).getCurrentTime() /
        (videoRef.current as any).getDuration()
      );
    }
    return 0;
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      const playedRatio = getPlayedRatio();
      dispatch(updateProgress({ playedRatio: playedRatio }));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, videoRef, dispatch]);

  useEffect(() => {
    if (!isPlaying && videoRef.current) {
      console.log("Seeking to", playedRatio);

      //(videoRef.current as any).seekTo(playedRatio, 'fraction');
    }
  }, [playedRatio, isPlaying]);

  const onProgress = (progress: any) => {
    console.log("Video.onProgress", progress.played, isPlaying);

    if (!isPlaying) {
      return;
    }

    dispatch(
      updateProgress({
        playedRatio: progress.played,
        playedSeconds: progress.playedSeconds,
      })
    );
  };

  // if (!path) return null;

  return (
    <ReactPlayer
      ref={videoRef}
      url={`${BACKEND_URL}/api/projects/${projectId}/video?media=1&path=${path}`}
      width="90%"
      height="90%"
      playing={isPlaying}
      loop={false}
      style={{ margin: "auto", marginBottom: 0, marginTop: 0 }}
      controls={false}
      onProgress={onProgress}
      // onStart={() => dispatch(startVideo())}
      onEnded={() => {
        dispatch(stopVideo());
        // dispatch(updateProgress({ playedRatio: 0 }));
      }}
      onPause={() => dispatch(stopVideo())}
    />
  );
};

export default Video;
