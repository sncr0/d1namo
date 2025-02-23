import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function StickyBar() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.stickyBar}>
      <TouchableOpacity
        onPress={() => router.replace("/LiveDataPage")}
        activeOpacity={0.8}
      >
        <Animated.Text
          style={[styles.buttonText, { transform: [{ scale: scaleAnim }] }]}
        >
          📊 What does my blood sugar look like? 🩸
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  stickyBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#202020",
    padding: 15,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
};
