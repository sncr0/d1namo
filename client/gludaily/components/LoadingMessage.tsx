import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoadingMessage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Loading your answer...</Text>
      <ActivityIndicator size="small" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  message: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default LoadingMessage;
