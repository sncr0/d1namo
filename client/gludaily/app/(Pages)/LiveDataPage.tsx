import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import LiveGraph from "@/components/LiveGraph";
import { useRouter } from "expo-router";

const router = useRouter();

const LiveDataPage = () => (
  <View style={styles.container}>
    <LiveGraph />
    <TouchableOpacity onPress={() => router.replace("/chatBot")}>
      <Text style={styles.backButton}>Back</Text> {/* Updated here */}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black", // Set the background color to white
  },
  backButton: {
    color: "white", // Set the text color to white
  },
});

export default LiveDataPage;
