import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Assett, fetchAssets, selectAssets } from "../../redux/slices/assets";
import { useAppDispatch } from "../../redux/store";
import { Grid, GridItem } from "@chakra-ui/react";
import { Image, Text } from "@chakra-ui/react";
import { BACKEND_URL } from "../../config";

const Assets = () => {
  const dispatch = useAppDispatch();
  const assets = useSelector(selectAssets);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
      {Object.values(assets).map((asset: Assett) => (
        <GridItem w="12" bg="blue.500" key={asset.id}>
          <img src={`${BACKEND_URL}${asset.thumbnailUrl}`} maxW={1} />
          <Text>{asset.id}</Text>
        </GridItem>
      ))}
    </Grid>
  );
};

export default Assets;
