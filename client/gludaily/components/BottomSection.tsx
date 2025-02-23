import {
  Box,
  Button,
  ButtonText,
  Card,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import React from "react";
import { DATA, DATA2 } from "./data";

interface ChartData {
  day: number;
  highTmp: number;
}

interface Props {
  chartData: ChartData[];
  setChartData: (data: ChartData[]) => void;
}

export const BottomSection = ({ chartData, setChartData }: Props) => {
  return (
    <>
      <Box
        marginTop={5}
        paddingTop={10}
        width="95%"
        height="30%"
        justifyContent="center"
      >
        <Card>
          <HStack justifyContent="space-between">
            <VStack >
              <Text  fontWeight="bold">
                Apple Computers
              </Text>
              <Text  fontWeight="bold">
                NASDAQ
              </Text>
              <Text  >Past Year</Text>
            </VStack>
          </HStack>
        </Card>
      </Box>
      <Button
        onPress={() => {
          if (chartData === DATA) {
            setChartData(DATA2);
          } else {
            setChartData(DATA);
          }
        }}
      >
        <ButtonText >Update Chart</ButtonText>
      </Button>
    </>
  );
};
