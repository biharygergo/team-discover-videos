import {
  VStack,
  Box,
  HStack,
  Flex,
  Text,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import React, { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  selectIsPlaying,
  selectMedia,
  selectPlayedRatio,
  updateProgress,
} from "../../redux/slices/video";
import { Track } from "../../interfaces/project";
import If from "../If";
import _ from "lodash-es";
import { useElementSize } from "usehooks-ts";
import Draggable from "react-draggable";
import { useAppDispatch } from "../../redux/store";
import { TbGripVertical, TbLock, TbEye } from "react-icons/tb";

const timelineHeight = 62;
const frameRate = 30;
const trackInfoWidth = 200;
const getIntValue = (obj: any): number => parseInt(obj["_text"], 10);

const Track = ({
  track,
  ratio,
  type
}: //   width,
{
  track: Track;
  ratio: number;
  type: string
  //   width: number;
}) => {
  //   const ratio = width / duration;
  const scale = useCallback((value: number) => value * (ratio - 0.1), [ratio]);

  const { clips, gaps } = useMemo(() => {
    if (track.clipitem === null || track.clipitem === undefined) {
      return { clips: [], gaps: [] };
    }

    if (_.isArray(track.clipitem)) {
      const { gaps } = track.clipitem.reduce(
        ({ gaps, previousEnd }, clip) => {
          if (gaps.length === 0) {
            return {
              gaps: [getIntValue(clip.start)],
              previousEnd: getIntValue(clip.end),
            };
          } else {
            const gap = getIntValue(clip.start) - previousEnd;
            return { gaps: [...gaps, gap], previousEnd: getIntValue(clip.end) };
          }
        },
        { gaps: [], previousEnd: 0 }
      );

      return { clips: track.clipitem, gaps };
    }
    return {
      clips: [track.clipitem],
      gaps: [getIntValue(track.clipitem.start)],
    };
  }, [track]);

  return (
    <Flex
      maxW="100%"
      height={timelineHeight}
      // bgColor="blue"
      direction="row"
      marginBottom={1}
      overflow="hidden"
    >
      <Flex
        w={trackInfoWidth}
        padding={4}
        paddingRight={0}
        bgColor="#242424"
        alignItems="center"
      >
        <TbGripVertical color="#8E8E8E" size={18} />
        <Text color="#8E8E8E" fontSize={14} marginLeft={2}>
          {type}
        </Text>
        <Spacer />
        <TbLock color="#8E8E8E" size={18} />
        <Icon as={TbEye} fontSize={18} color="#8E8E8E" marginLeft={2} marginRight={4}></Icon>
        <Box  bgColor="#0C0C0C" w={4} h={timelineHeight}/>
      </Flex>
      <If
        condition={track.clipitem !== null}
        then={() =>
          clips.map((clip, index) => (
            <Box
              bgColor={type === 'Video' ? "#EB6E52" : '#28E29F'}
              borderRadius={6}
              //   maxW={10}
              marginLeft={scale(gaps[index])}
              marginTop={1}
              key={index}
              width={scale(getIntValue(clip.end) - getIntValue(clip.start))}
              height={timelineHeight - 8}
              border="1px black solid"
            ></Box>
          ))
        }
      />
    </Flex>
  );
};

const TimeIndicator = () => {
  return (
    <Box
      bgColor="black"
      //   position="absolute"
      width={1}
      height={800}
      // left={playedRatio * width}
      bottom={0}
      // transition={isPlaying ? "all 0.05s": 'none' }
    ></Box>
  );
};

const Tracks = ({ video, audio, ratio }: any) => {
  return (
    <>
      <Flex direction="column-reverse">
        {video.map((track: Track, index: number) => (
          <Track track={track} key={index} ratio={ratio}type="Video" />
        ))}
      </Flex>
      <Flex direction="column">
        {audio.map((track: Track, index: number) => (
          <Track track={track} key={index} ratio={ratio} type="Audio"/>
        ))}
      </Flex>
    </>
  );
};

export const Sequence = () => {
  const dispatch = useAppDispatch();
  const { media, duration } = useSelector(selectMedia);
  const isPlaying = useSelector(selectIsPlaying);
  const playedRatio = useSelector(selectPlayedRatio);
  const [sequenceRef, { width, height }] = useElementSize();

  const durationFrame = useMemo(() => {
    return getIntValue(duration);
  }, [duration]);

  const onDrag = (event: any) => {
    console.log("onDrag");

    dispatch(updateProgress({ playedRatio: event.x / width }));
  };

  const seconds = useMemo(() => {
    return (durationFrame * playedRatio) / frameRate;
  }, [durationFrame, playedRatio]);

  const { video, audio } = useMemo(() => {
    return {
      video: media.video.track.filter((track) => track.clipitem),
      audio: media.audio.track.filter((track) => track.clipitem),
    };
  }, [(media as any).tracks]);

  //   const ratio = useThrottleFn(value => width / durationFrame, 200, [width]);

  //   console.log(ratio);

  //   (value => value, 200, [value])
  const ratio = useMemo(() => {
    return (width - trackInfoWidth) / durationFrame;
  }, [width, durationFrame]);

  //   console.log({ratio, ratioT});

  // TODO: scale factor
  return (
    <>
      <If
        condition={isPlaying}
        then={() => (
          <Box
            bgColor="red"
            position="absolute"
            // width={1}
            // height={800}
            left={playedRatio * (width - trackInfoWidth) + trackInfoWidth}
            bottom={0}
            transition={isPlaying ? "all 0.05s" : "none"}
          >
            <TimeIndicator />
          </Box>
        )}
        else={() => (
          <Draggable
            axis="x"
            handle=".handle"
            defaultPosition={{ x: playedRatio * width, y: 0 }}
            // bounds="parent"
            // style={{}}
            // position={null}
            grid={[25, 25]}
            scale={1}
            // onStart={this.handleStart}
            onDrag={onDrag}
            // onStop={(event) =>console.log(event)
          >
            <Box
              bgColor="red"
              className="handle"
              position="absolute"
              bottom={0}
            >
              <TimeIndicator />
            </Box>
          </Draggable>
        )}
      />

      <Text fontSize={24}>{`00:${String(Math.floor(seconds)).padStart(
        2,
        "0"
      )}:${String((30 * (seconds % 1)).toFixed(0)).padStart(2, "0")}`}</Text>
      <Flex direction="column" ref={sequenceRef}>
        <Tracks ratio={ratio} video={video} audio={audio} />
      </Flex>
    </>
  );
};

export default Sequence;
