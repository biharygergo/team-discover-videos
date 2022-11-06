import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Assett, fetchAssets, selectAssets } from "../../redux/slices/assets";
import { useAppDispatch } from "../../redux/store";
import { Box, Flex, Grid, GridItem, HStack } from "@chakra-ui/react";
import { Image, Text } from "@chakra-ui/react";
import { BACKEND_URL } from "../../config";

const Assets = () => {
  const dispatch = useAppDispatch();
  const assets = useSelector(selectAssets);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  return (
    <Box position={"relative"}>
      <Flex gap={3} flexWrap={"wrap"} p={8} direction={["column", "row"]}>
        {Object.values(assets).map((asset: Assett) => (
          <Box
            width={150}
            bg="blue.500"
            key={asset.id}
            borderRadius={"lg"}
            overflow="hidden"
          >
            <img
              src={`${BACKEND_URL}${asset.thumbnailUrl}`}
              style={{ objectFit: "cover", height: "100%" }}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Assets;
