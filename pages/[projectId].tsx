import Head from "next/head";
import Image from "next/image";
// @ts-ignore
import useKeypress from "react-use-keypress";
import styles from "../styles/Home.module.css";
import {BounceLoader} from 'react-spinners';
import {
  Flex,
  Spacer,
  AspectRatio,
  Box,
  Text,
  Button,
  Tag,
} from "@chakra-ui/react";
import Video from "../components/Video/wrapper";
import { useEffect, useState } from "react";
import VideoOverlay from "../components/VideoOverlay";
import { useSelector } from "react-redux";
import { selectOpenComment } from "../redux/slices/comments";
import Sequence from "../components/Timeline";
import { useAppDispatch } from "../redux/store";
import {
  getVideo,
  pollVideo,
  selectIsPlaying,
  selectMedia,
  selectVideoStatus,
  setProjectId,
  startVideo,
  stopVideo,
} from "../redux/slices/video";
import Assets from "../components/Assets";
import Control from "../components/Control";
import { useRouter } from "next/router";
import If from "../components/If";
import { fetchAssets } from "../redux/slices/assets";

export default function Home() {
  const dispatch = useAppDispatch();
  const content = useSelector(selectMedia);
  const isPlaying = useSelector(selectIsPlaying);
  const openCommentId = useSelector(selectOpenComment);
  const router = useRouter();
  const projectId = router.query.projectId;
  const status = useSelector(selectVideoStatus);

  useEffect(() => {
    console.log({ projectId });

    if (projectId) {
      dispatch(setProjectId({ projectId: projectId as string }));
      dispatch(getVideo(projectId as string));
      dispatch(fetchAssets());
    }

    const interval = setInterval(() => {
      if (projectId) {
        dispatch(pollVideo());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [projectId]);

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

  if (!content) {
    return null;
  }

  return (
    <Flex direction="row" height="100vh">
      <Flex direction="column" flex="1" borderRight="4px solid #10110E">
        <Box
        // width="100%"
        >
          <Flex
            direction="row"
            width="100%"
            height="64px"
            alignItems="center"
            bgColor="#1B1A1D"
            borderBottom="4px solid #10110E"
          >
            <img
              src="logo.png"
              style={{ height: 40, marginTop: 0, marginLeft: 8 }}
            />
            <Spacer />
            <If
              condition={status !== "done"}
              then={() => (
                <>
                <BounceLoader speedMultiplier={0.75} color="#DE0030" size={22}/>
                <Tag
                  size={"lg"}
                  variant="outline"
                  colorScheme="red"
                  height={8}
                  marginRight={4}
                  marginLeft={2}
                >
                  Rendering
                </Tag>
                </>
              )}
              else={() => (
                <Tag
                  size={"lg"}
                  variant="solid"
                  colorScheme="teal"
                  height={8}
                  marginRight={4}
                >
                  Video Ready
                </Tag>
              )}
            />
          </Flex>
        </Box>

        <Box
          flex="1"
          overflowY={"scroll"}
          position="relative"
          bgColor="#1B1A1D"
          borderBottom="4px solid #10110E"
        >
          <Assets />
          {/* <Box
            height={100}
            background="linear-gradient(0deg, rgba(12,12,12,1) 0%, rgba(12,12,12,0) 85%)"
            position={"sticky"}
            bottom={0}
            left={0}
            width="100%"
          ></Box> */}
        </Box>
        <Box flex="1" bg="#1B1A1D">
          <Sequence />
        </Box>
      </Flex>
      <Flex
        width="calc(100vh * 9 / 16  + 20px)"
        height="100vh"
        bgColor="#1B1A1D"
        position="relative"
        // padding={4}
        paddingTop={12}
        direction="column"
        alignItems="center"
        justifyContent="top"
      >
        {/* <div> */}
        {!isPlaying && <VideoOverlay />}
        <Video />
        {/* </div> */}
        <Control />
      </Flex>
    </Flex>
  );
}
