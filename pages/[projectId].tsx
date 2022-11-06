import Head from "next/head";
import Image from "next/image";
// @ts-ignore
import useKeypress from "react-use-keypress";
import styles from "../styles/Home.module.css";
import { Flex, Spacer, AspectRatio, Box, Text, Button } from "@chakra-ui/react";
import Video from "../components/Video/wrapper";
import { useEffect, useState } from "react";
import VideoOverlay from "../components/VideoOverlay";
import { useSelector } from "react-redux";
import { selectOpenComment } from "../redux/slices/comments";
import Sequence from "../components/Timeline";
import { useAppDispatch } from "../redux/store";
import {
  pollVideo,
  selectIsPlaying,
  startVideo,
  stopVideo,
} from "../redux/slices/video";
import Assets from "../components/Assets";
import Control from "../components/Control";

export default function Home() {
  const dispatch = useAppDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const openCommentId = useSelector(selectOpenComment);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(pollVideo());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useKeypress(" ", () => {
    console.log("space pressed", openCommentId, isPlaying);
    if (openCommentId === null) {
      if (isPlaying) {
        dispatch(stopVideo());
      } else {
        dispatch(startVideo());
      }
    }

    // Do something when the user has pressed the Escape key
  });

  return (
    <Flex direction="row" height="100vh">
      <Flex direction="column" flex="1">
        <Box flex="1" overflowY={"scroll"} position="relative">
          <Assets />
          <Box
            height={100}
            background="linear-gradient(0deg, rgba(12,12,12,1) 0%, rgba(12,12,12,0) 35%)"
            position={"sticky"}
            bottom={0}
            left={0}
            width="100%"
          ></Box>
        </Box>
        <Box flex="1.5" bg="#0C0C0C">
          <Sequence />
        </Box>
      </Flex>
      <Flex
        width="calc(100vh * 9 / 16  + 20px)"
        height="100vh"
        bgColor="#242424"
        position="relative"
        // padding={4}
        paddingTop={12}
        direction="column"
        alignItems="center"
        justifyContent="top"
      >
        {/* <div> */}
        <VideoOverlay />
        <Video />
        {/* </div> */}
        <Control />
      </Flex>
    </Flex>
  );
}
