import React from "react";
import { View, StyleSheet } from "react-native";
// import { VictoryLine } from "victory-native";

const LiveGraphVictory = () => {
  const data = [
    { x: 1, y: 3 },
    { x: 2, y: 7 },
    { x: 3, y: 12 },
    { x: 4, y: 5 },
    { x: 5, y: 9 },
    { x: 6, y: 15 },
  ];

  return (
    <></>
    // <View style={styles.container}>
    //   <VictoryLine
    //     data={data}
    //     width={350}
    //     height={300}
    //     scale={{ x: 'linear', y: 'linear' }}
    //   />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LiveGraphVictory;
