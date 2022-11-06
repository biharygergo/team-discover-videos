import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  selectIsPlaying,
  startVideo,
  stopVideo,
} from "../../redux/slices/video";
import { useAppDispatch } from "../../redux/store";
import If from "../If";

const Control = () => {
  const dispatch = useAppDispatch();
  const isPlayling = useSelector(selectIsPlaying);

  return (
    <HStack marginTop={6}>
      <Button
        onClick={() =>
          isPlayling ? dispatch(stopVideo()) : dispatch(startVideo())
        }
      >
        <If
          condition={!isPlayling}
          then={() => <FaPlay />}
          else={() => <FaPause />}
        />
      </Button>
    </HStack>
  );
};

export default Control;
