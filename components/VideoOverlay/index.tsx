import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useElementSize, useWindowSize } from "usehooks-ts";
import CommandPopover from "./CommentPopover";
import { useSelector } from "react-redux";
import { addComment, closeComment, CommentState, selectComments, selectOpenComment } from "../../redux/slices/comments";
import { useAppDispatch } from "../../redux/store";
import { nanoid } from 'nanoid'

const VideoOverlay = () => {
  const overlayRef = useRef<any>(null);
  const comments = useSelector(selectComments);
  const dispatch = useAppDispatch()
  const { width, height } = useWindowSize();
  const openCommentId = useSelector(selectOpenComment);



  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const overlay = overlayRef.current?.getBoundingClientRect();
    setSize({ width: overlay.width, height: overlay.height });
  }, [width, height]);

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (openCommentId !== null) {
      dispatch(closeComment());
      return;
    }

    const overlay = overlayRef.current?.getBoundingClientRect();

    const overlayX = overlay.left;
    const overlayY = overlay.top;

    const clickX = event.pageX;
    const clickY = event.pageY;

    dispatch(addComment({
      id: nanoid(),
      x: (clickX - overlayX) / size.width,
      y: (clickY - overlayY) / size.height,
      rawText: "",
      state: CommentState.RawInput
    }))
  };

  return (
    <Box
      ref={overlayRef}
      width="90%"
      height="90%"
      position="absolute"
      // top={0}
      bottom={0}
      zIndex={100}
      onClick={clickHandler}
      bgColor="red"
      opacity={0.5}
    >
      {comments.map((comment, index) => (
        <CommandPopover comment={comment} size={size} key={index}/>
      ))}
    </Box>
  );
};

export default VideoOverlay;
