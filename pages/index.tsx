import Head from "next/head";
import Image from "next/image";
// @ts-ignore
import useKeypress from "react-use-keypress";
import styles from "../styles/Home.module.css";
import { Flex, Spacer, AspectRatio, Box, Text } from "@chakra-ui/react";
import Video from "../components/Video/wrapper";
import { useState } from "react";
import VideoOverlay from "../components/VideoOverlay";
import { useSelector } from "react-redux";
import { selectOpenComment } from "../redux/slices/comments";
import Sequence from "../components/Timeline";
import { useAppDispatch } from "../redux/store";
import { selectIsPlaying, startVideo, stopVideo } from "../redux/slices/video";

export default function Home() {
  const dispatch = useAppDispatch();
  const isPlaying = useSelector(selectIsPlaying);
  const openCommentId = useSelector(selectOpenComment);

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
    <Flex color="white" bgColor="red" direction="row" height="100vh">
      <Flex direction="column" flex="1">
        <Box flex="1" bg="yellow">
          <Text>Box 3</Text>
        </Box>
        <Box flex="1" bg="green">
          <Sequence />
        </Box>
      </Flex>
      <Box
        width="calc(100vh * 9 / 16)"
        height="100vh"
        bgColor="blue"
        position="relative"
      >
        <VideoOverlay />
        <Video  />
      </Box>
    </Flex>
  );
}
