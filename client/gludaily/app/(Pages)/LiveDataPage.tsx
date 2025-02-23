import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import LiveGraph from "@/components/LiveGraph";
import { useRouter } from "expo-router";

const router = useRouter();

const LiveDataPage = () => (
  <View style={styles.container}>
    <LiveGraph />
    <TouchableOpacity onPress={() => router.replace("/chatBot")}>
      <Text style={styles.backButton}>Back</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  backButton: {
    color: "white",
  },
});

export default LiveDataPage;
