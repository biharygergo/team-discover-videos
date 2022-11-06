import { Button, HStack } from "@chakra-ui/react";
import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
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
    <HStack marginTop={6} zIndex={999} spacing={8}>
      <FaStepBackward color="white" size={22}/>
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
      <FaStepForward color="white"  size={22}/>
    </HStack>
  );
};

export default Control;
