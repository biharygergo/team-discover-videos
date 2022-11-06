import { Grid, GridItem, Flex, Box, Button } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import SmallVideo from "../components/SmallVideo/wrapper";
import _ from "lodash-es";
import If from "../components/If";
import { DotLoader } from "react-spinners";

const userIds = [
  "5795691331_1",
  "2054248543_1",
  "2049388144_1",
  "1775443684_1",
  "1659656459_1",
  "1636817964_1",
  "1542975279_1",
  "1405293618_1",
  "981652458_1",
  "883055368_1",
  "817265251_1",
  "510170885_1",
  "108723944_1",
  "21516337_1",
];

const Generate = () => {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(
    new Array(userIds.length).fill(false)
  );
  const [index, setIndex] = useState(0);
  const visibilityOrder = useMemo(() => {
    const range = _.range(0, userIds.length);
    return _.shuffle(range);
  }, []);

  useEffect(() => {
    if (!running || index >= userIds.length) {
      return;
    }

    const interval = setInterval(() => {
      const nextOne = visibilityOrder[index];
      const tempVis = [...visibility];
      tempVis[nextOne] = true;
      setVisibility(tempVis);
      setIndex(index + 1);
    }, 500);
    return () => clearInterval(interval);
  }, [running, visibility, index]);

  useEffect(() => {
    if (!loading) {
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
      setRunning(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <>
      <Flex
        width="100%"
        height="100vh"
        display={!running || loading ? "flex" : "none"}
        alignItems="center"
        justifyContent="center"
      >
        <If
          condition={!running && !loading}
          then={() => (
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => setLoading(true)}
            >
              Make it rain!
            </Button>
          )}
        />
        <If
          condition={loading}
          then={() => <DotLoader size={200} color="#52EAEB" />}
        />
      </Flex>
      <Flex
        gap={6}
        flexWrap={"wrap"}
        p={6}
        direction={["column", "row"]}
        paddingTop={4}
      >
        {userIds.map((id, index) => (
          <Box key={id}>
            <SmallVideo userId={id} visible={visibility[index]} />
          </Box>
        ))}
      </Flex>
    </>
  );
};

export default Generate;
