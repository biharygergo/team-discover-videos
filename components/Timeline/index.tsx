import { VStack, Box, HStack, Flex } from "@chakra-ui/react";
import React, { useMemo } from "react";
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

const ratio = 1.3;
const scale = (value: number) => value * ratio;
const timelineHeight = 50;

const getIntValue = (obj: any): number => parseInt(obj["_text"], 10);

const Track = ({ track }: { track: Track }) => {
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
      width="100%"
      height={timelineHeight}
      bgColor="blue"
      direction="row"
      marginBottom={2}
    >
      <If
        condition={track.clipitem !== null}
        then={() =>
          clips.map((clip, index) => (
            <Box
              bgColor="red"
              marginLeft={scale(gaps[index])}
              key={index}
              width={scale(getIntValue(clip.end) - getIntValue(clip.start))}
              height={timelineHeight}
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

export const Sequence = () => {
  const dispatch = useAppDispatch();
  const media = useSelector(selectMedia);
  const isPlaying = useSelector(selectIsPlaying);
  const playedRatio = useSelector(selectPlayedRatio);
  const [sequenceRef, { width, height }] = useElementSize();

  const onDrag = (event) => {
    dispatch(updateProgress({ playedRatio: event.x / width }));
  };

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
            left={playedRatio * width}
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

      <Flex direction="column" ref={sequenceRef}>
        <Flex direction="column-reverse">
          {media.video.track.map((track, index) => (
            <Track track={track} key={index} />
          ))}
        </Flex>
        <Flex direction="column">
          {media.audio.track.map((track, index) => (
            <Track track={track} key={index} />
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default Sequence;
