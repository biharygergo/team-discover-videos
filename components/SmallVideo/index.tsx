import { Box } from "@chakra-ui/react";
import React from "react";
import ReactPlayer from "react-player";
import If from "../If";

interface Props {
  userId: string;
  visible: boolean;
}

const width = 210;

export const SmallVideo = (props: Props) => {
  return (
    <Box height={(width * 16) / 9} width={width}>
      <If
        condition={props.visible}
        then={() => (
          <ReactPlayer
            url={`/video/output/${[props.userId]}.mp4`}
            width={width}
            height={(width * 16) / 9}
            playing={true}
            loop={true}
            muted={true}
          />
        )}
      />
    </Box>
  );
};

export default SmallVideo;
