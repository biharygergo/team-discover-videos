import React, { useLayoutEffect, useRef, useState } from "react";
import { CheckIcon } from "@chakra-ui/icons";
// @ts-ignore
import useKeypress from "react-use-keypress";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Box,
  Button,
  useDisclosure,
  Input,
  InputRightElement,
  InputGroup,
  Text,
  Divider,
  Kbd,
  HStack,
} from "@chakra-ui/react";
import {
  closeComment,
  Comment,
  CommentState,
  openComment,
  selectOpenComment,
  updateComment,
} from "../../redux/slices/comments";
import { useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { ClientRequest } from "http";
import { processCommand } from "../../ai/command-processor";
import If from "../If";
import { updateVideo } from "../../redux/slices/video";

interface Props {
  comment: Comment;
  size: { width: number; height: number };
}

export const CommandPopover = ({ comment, size }: Props) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [commentState, setCommentState] = useState("");
  const dispatch = useAppDispatch();
  const openCommentId = useSelector(selectOpenComment);

  const onToggle = (event: any) => {
    event.stopPropagation();

    if (openCommentId === comment.id) {
      dispatch(closeComment());
    } else {
      dispatch(openComment(comment.id));
    }
  };

  const onClose = () => {
    dispatch(closeComment());
  };

  useKeypress("Enter", () => {
    if (openCommentId === comment.id) {
      console.log(text);
      dispatch(
        updateComment({
          id: comment.id,
          rawText: text,
        })
      );
      const command = processCommand(text);

      if (!command) {
        return;
      }

      // TODO: error state
      dispatch(
        updateComment({
          id: comment.id,
          state: CommentState.Detected,
          command: {
            ...command,
            time: 1, // TODO: get this from player
          },
        })
      );
    }
  });

  const onType = (event: any) => {
    event.stopPropagation();
    setText(event.target.value);
  };

  const onConfirm = async () => {
    if (comment.command !== null && comment.command !== undefined) {
      await dispatch(updateVideo(comment.command));
    }
  };

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={openCommentId === comment.id}
      placement="top"
      onClose={onClose}
      closeOnBlur={true}
      trigger="click"
    >
      <PopoverTrigger>
        <Box
          key={`${comment.x}-${comment.y}`}
          width="10"
          height="10"
          position="absolute"
          zIndex={1}
          top={comment.y * size.height}
          left={comment.x * size.width}
          onClick={onToggle}
        >
          <Button colorScheme={openCommentId === comment.id ? "blue" : ""}>
            Open
          </Button>
        </Box>
      </PopoverTrigger>
      <PopoverContent onClick={(e) => e.stopPropagation()}>
        <PopoverArrow />
        <PopoverHeader>Confirmation!</PopoverHeader>
        <PopoverBody>
          <If
            condition={comment.state === CommentState.RawInput}
            then={() => (
              <InputGroup>
                <Input
                  placeholder="Basic usage"
                  color="black"
                  onChange={onType}
                  value={text}
                />
                <InputRightElement>
                  <CheckIcon color="green.500" />
                </InputRightElement>
              </InputGroup>
            )}
          />
          <If
            condition={comment.state === CommentState.Detected}
            then={() => (
              <>
                <Text color="black">{comment.rawText}</Text>
                <Divider />
                <HStack spacing="8px" color="black">
                  <Kbd>{comment.command?.action}</Kbd>
                  <Kbd>{comment.command?.type}</Kbd>
                  <Text color="black">with</Text>
                  <Kbd>{comment.command?.value}</Kbd>
                </HStack>
                <Button colorScheme="blue" onClick={onConfirm}>Confirm</Button>
              </>
            )}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CommandPopover;
