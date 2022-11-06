import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, Icon } from "@chakra-ui/icons";
// @ts-ignore
import useKeypress from "react-use-keypress";
import { SyncLoader } from "react-spinners";

import {
  Popover,
  Flex,
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
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  VStack,
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import {
  closeComment,
  Comment,
  CommentState,
  deleteComment,
  openComment,
  selectOpenComment,
  updateComment,
} from "../../redux/slices/comments";
import { useAppDispatch } from "../../redux/store";
import { useSelector } from "react-redux";
import { ClientRequest } from "http";
import { FootageType, processCommand } from "../../ai/command-processor";
import If from "../If";
import { pollVideo, selectMedia, selectPlayedRatio, updateVideo } from "../../redux/slices/video";
// import { FaComment, FaRegComment } from "react-icons/fa";
import { MdChatBubbleOutline, MdChatBubble } from "react-icons/md";
import { GrReturn } from "react-icons/gr";
import _ from "lodash-es";
import { Assett, selectAssets } from "../../redux/slices/assets";

interface Props {
  comment: Comment;
  size: { width: number; height: number };
}

export const CommandPopover = ({ comment, size }: Props) => {
  // const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  // const [commentState, setCommentState] = useState("");
  const dispatch = useAppDispatch();
  const openCommentId = useSelector(selectOpenComment);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(false);
  const assets = useSelector(selectAssets);
  
  const [selectedAsset, setSelectedAsset] = useState<null | string>(null);
  const { media, duration } = useSelector(selectMedia) as any;
  const playedRatio = useSelector(selectPlayedRatio);

  const durationFrame = useMemo(() => {
    return  parseInt(duration["_text"], 10)
  }, [duration]);

  const assetOptions = useMemo(() => {
    if (comment && comment.command) {
      return Object.values(assets).filter(
        (a: any) => a.type === comment.command?.type
      );
    }

    return [];
  }, [comment, assets]);

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
    setError(false);
    if (openCommentId === comment.id) {
      setProcessing(true);
      dispatch(
        updateComment({
          id: comment.id,
          rawText: text,
        })
      );
      const command = processCommand(text);

      setTimeout(() => {
        setProcessing(false);
        if (!command) {
          setError(true);
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

        dispatch(pollVideo());
      }, 1500);
    }
  });

  const onType = (event: any) => {
    event.stopPropagation();
    setText(event.target.value);
  };

  const onConfirm = async () => {
    const time = durationFrame / 30 * playedRatio;
    if (comment.command !== null && comment.command !== undefined) {
      if (comment.command.type === FootageType.Text) {
        await dispatch(updateVideo({...comment.command, time}));
      } else {
        await dispatch(
          updateVideo({ ...comment.command, value: selectedAsset, time })
        );
        setSelectedAsset(null);
      }

      dispatch(closeComment())
      dispatch(deleteComment(comment.id))
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
          {/* <Button colorScheme={openCommentId === comment.id ? "blue" : ""}> */}
          {/* Open */}
          {/* </Button> */}
          <Icon
            as={
              openCommentId === comment.id ? MdChatBubble : MdChatBubbleOutline
            }
            fontSize={40}
            color={openCommentId === comment.id ? "#52EAEB" : "white"}
          ></Icon>
        </Box>
      </PopoverTrigger>
      <PopoverContent onClick={(e) => e.stopPropagation()}>
        <PopoverArrow />
        <PopoverHeader>Change request</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <If
            condition={comment.state === CommentState.RawInput}
            then={() => (
              <If
                condition={processing}
                then={() => (
                  <Flex
                    w="100%"
                    h="100px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <SyncLoader color="#52EAEB" speedMultiplier={0.75} />
                  </Flex>
                )}
                else={() => (
                  <If
                    condition={error}
                    then={() => (
                      <Alert status="warning">
                        <AlertIcon />
                        <Flex direction="column">
                          <strong>Our AI is not there yet.</strong>
                          <span>Please try a different prompt!</span>
                          <Button
                            bgColor="#28E29F"
                            onClick={() => setError(false)}
                            marginTop={4}
                          >
                            Retry
                          </Button>
                        </Flex>
                      </Alert>
                    )}
                    else={() => (
                      <InputGroup>
                        <Textarea
                          placeholder="Replace title with Junction 2023"
                          color="black"
                          onChange={onType}
                          value={text}
                          height={20}
                          style={{ resize: "none" }}
                          autoFocus
                        />
                        <InputRightElement>
                          <GrReturn color="#8E8E8E" />
                        </InputRightElement>
                      </InputGroup>
                    )}
                  />
                )}
              />
            )}
          />
          <If
            condition={comment.state === CommentState.Detected}
            then={() => (
              <>
                <Text as="b">Your Prompt</Text>:<br />
                <Text as="i">{comment.rawText}</Text>
                <br />
                <br />
                <Text as="b">Recognized Command</Text>:<br />
                <VStack spacing={2} alignItems="start" marginTop={2}>
                  <Text>
                    Action: <Kbd>{_.capitalize(comment.command?.action)}</Kbd>
                  </Text>
                  <Text>
                    Footage: <Kbd>{_.capitalize(comment.command?.type)}</Kbd>
                  </Text>
                  <If
                    condition={true}
                    then={() => {
                      if (comment.command?.type === FootageType.Text) {
                        return (
                          <Text>
                            New value: <Kbd>{comment.command?.value}</Kbd>
                          </Text>
                        );
                      }

                      return (
                        <FormControl>
                          <Text>
                            Select {_.capitalize(comment.command?.type)}:
                          </Text>
                          <Select
                            placeholder="Select option"
                            onChange={(event) =>
                              setSelectedAsset(event.target.value)
                            }
                            defaultValue={assetOptions.length > 0 ? assetOptions[0].id : ''}
                          >
                            {assetOptions.map((o: any) => (
                              <option value={o.id} key={o.id}>
                                {o.id}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    }}
                  />
                </VStack>
                <Button
                  bgColor="#28E29F"
                  onClick={onConfirm}
                  w="100%"
                  marginTop={8}
                >
                  Apply Change
                </Button>
              </>
            )}
          />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CommandPopover;
