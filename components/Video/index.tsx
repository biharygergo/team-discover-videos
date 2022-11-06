import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch } from "../../redux/store";
import {
  selectIsPlaying,
  selectPlayedRatio,
  startVideo,
  stopVideo,
  updateProgress,
} from "../../redux/slices/video";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface Props {}

export const Video = (props: Props) => {
  const dispatch = useAppDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const playedRatio = useSelector(selectPlayedRatio);
  const videoRef = useRef(null);

  const getPlayedRatio = () => {
    if (videoRef.current) {
      return videoRef.current.getCurrentTime() / videoRef.current.getDuration();
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
      videoRef.current.seekTo(playedRatio);
    }
  }, [playedRatio, isPlaying]);

  const onProgress = (progress: any) => {
    dispatch(
      updateProgress({
        playedRatio: progress.played,
        playedSeconds: progress.playedSeconds,
      })
    );
  };

  return (
    <ReactPlayer
      ref={videoRef}
      // url={"https://98f7-2001-708-150-10-00-635c.eu.ngrok.io/api/projects/final_project/video?media=1"}
      url={"./video/output/video.mp4"}
      width="90%"
      height="90%"
      playing={isPlaying}
      loop={false}
      style={{margin: 'auto', marginBottom: 0, marginTop: 0}}
      controls={false}
      onProgress={onProgress}
      onStart={() => dispatch(startVideo())}
      onEnded={() => {
        dispatch(stopVideo());
        dispatch(updateProgress({ playedRatio: 0 }));
      }}
      onPause={() => dispatch(stopVideo())}
    />
  );
};

export default Video;
