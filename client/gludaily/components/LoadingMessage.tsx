import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from "react-native";

const messages = [
  "Analyzing your data, please hold on...",
  "Fetching your latest glucose readings...",
  "Processing your health information...",
  "Getting the results for you...",
  "Loading your personalized health insights...",
  "Crunching the numbers, one moment...",
  "Retrieving your blood sugar trends...",
  "Gathering the data for your health report...",
  "Preparing your diabetes management updates...",
  "Almost there, gathering your latest results...",
  "Looking up your recent health stats...",
  "Loading your glucose level history...",
  "Fetching the latest recommendations for you...",
  "Analyzing your blood sugar patterns...",
  "Just a moment, compiling your health data...",
  "Checking your daily glucose trends...",
  "Loading your personalized advice...",
  "Fetching the latest results from your devices...",
  "Retrieving recent glucose readings and trends...",
  "Processing your health metrics, please wait...",
];

const LoadingMessage = () => {
  const highlightAnim = useRef(new Animated.Value(0)).current; // Animation value

  useEffect(() => {
    // Start the animation loop
    const animateHighlight = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(highlightAnim, {
            toValue: 1, // Move highlight to the right
            duration: 1000, // Duration of the animation
            useNativeDriver: true, // Use native driver for better performance
          }),
          Animated.timing(highlightAnim, {
            toValue: 0, // Reset highlight to the left
            duration: 0, // Instant reset
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateHighlight(); // Start the animation

    return () => {
      highlightAnim.stopAnimation(); // Cleanup animation on unmount
    };
  }, [highlightAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.message}>
          {messages[Math.floor(Math.random() * messages.length)]}
        </Text>
        <Animated.View
          style={[
            styles.highlight,
            {
              transform: [
                {
                  translateX: highlightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 150], // Adjust based on text width
                  }),
                },
              ],
            },
          ]}
        />
      </View>
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
  textContainer: {
    position: "relative",
    overflow: "hidden", // Ensure the highlight doesn't overflow
  },
  message: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  highlight: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "30%", // Width of the highlight
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
  },
});

export default LoadingMessage;
