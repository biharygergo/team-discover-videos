import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Assett, fetchAssets, selectAssets } from "../../redux/slices/assets";
import { useAppDispatch } from "../../redux/store";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import { Image, Text } from "@chakra-ui/react";
import { BACKEND_URL } from "../../config";
import { AddIcon, Icon } from "@chakra-ui/icons";
/* import { IoMdPhotos } from "react-icons/Io";
 */
import {
  TbGripVertical,
  TbLock,
  TbEye,
  TbVideo,
  TbMusic,
} from "react-icons/tb";

import { ImFilePicture } from "react-icons/Im";

const icons = {
  video: TbVideo,
  audio: TbMusic,
  image: ImFilePicture,
};

const Assets = () => {
  const dispatch = useAppDispatch();
  const assets = useSelector(selectAssets);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  return (
    <Box position={"relative"}>
      <HStack alignItems={"center"}>
        <Text
          color="#8E8E8E"
          paddingLeft={8}
          fontSize={18}
          paddingTop={4}
          fontWeight={600}
        >
{/*           <Icon as={IoMdPhotos} fontSize={18} color="#8E8E8E" marginBottom={-0.5} marginRight={1}></Icon> Project
 */}          Library
        </Text>
      </HStack>

      <Flex
        gap={3}
        flexWrap={"wrap"}
        p={8}
        direction={["column", "row"]}
        paddingTop={4}
      >
        {Object.values(assets).map((asset: any) => (
          <Flex
            width={120}
            bg="blue.500"
            key={asset.id}
            borderRadius={"lg"}
            overflow="hidden"
            justifyContent="center"
            position="relative"
          >
            {/* <Text position="relative" bottom={0}>
              {asset.id}
            </Text> */}

            <Tag
              size="sm"
              variant="subtle"
              colorScheme="cyan"
              position="absolute"
              margin="auto"
              // marginTop={4}
              bottom={4}
            >
              <TagLeftIcon
                boxSize="12px"
                as={
                  (icons as any)[asset.type]
                }
              />
              <TagLabel>{asset.id}</TagLabel>
            </Tag>

            <img
              src={`${BACKEND_URL}${asset.thumbnailUrl}`}
              style={{ objectFit: "cover", height: "100%" }}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export default Assets;
