import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Circle from "@/components/Circle";
import LoadingMessage from "@/components/LoadingMessage";
import StickyBar from "@/components/StickyBar";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      text: "Hi Ashley, welcome to GluDaily! What do you want to eat today?",
      sender: "bot",
    },
  ]);

  const [session_id, setSession_id] = useState("");
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send a message to the chatbot
  const sendMessage = async () => {
    if (inputText.trim() !== "") {
      setLoading(true);
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");
      inputRef.current?.focus(); // Refocus the input field
      // Hard-coded API call to local API from expo.
      const ipAddress = "10.253.132.164";
      const uri = `http://${ipAddress}:8000/chatbot/chat`;

      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session_id,
          message: inputText,
        }),
      });

      const data = await response.json();
      setSession_id(data.session_id);
      if (data.image) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: data.response,
            sender: "bot",
          },
          {
            text: "Here's your graph",
            sender: "bot",
            image: `data:image/jpeg;base64,${data.image}`, // Add base64 image to message
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: "bot" },
        ]);
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF8EF" }}>
      <View
        style={{
          position: "absolute",
          top: -700,
          left: 500,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Circle
            key={i}
            style={{ position: "absolute" }}
            size={400 - i * 30}
            borderWidth={1} // Starts at 10 and decreases by 1 for each subsequent circle
          />
        ))}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust as needed
      >
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ padding: 20 }}>
            {/* Static Content and initial bot messages */}
            {messages.map((message, index) =>
              message.sender === "bot" && message.image ? (
                <React.Fragment key={index}>
                  <View style={styles.botMessageContainer}>
                    <Text style={styles.botMessage}>{message.text}</Text>
                    <Image
                      source={{ uri: message.image }}
                      style={styles.graphImage}
                    />
                  </View>
                </React.Fragment>
              ) : message.sender === "bot" ? (
                <View key={index} style={styles.botMessageContainer}>
                  <Text style={styles.botMessage}>{message.text}</Text>
                </View>
              ) : (
                <View key={index} style={styles.userMessageContainer}>
                  <Text style={styles.userMessage}>{message.text}</Text>
                </View>
              )
            )}

            {loading && (
              <View style={styles.botMessageContainer}>
                <LoadingMessage />
              </View>
            )}
          </View>
        </ScrollView>
        <View
          style={[
            styles.inputContainer,
            { paddingBottom: keyboardVisible ? insets.bottom : 10 },
          ]}
        >
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type the food name here"
            placeholderTextColor="white"
            value={inputText}
            onChangeText={setInputText}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="mic" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={sendMessage}>
            <Feather name="arrow-up" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <StickyBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8EF",
  },
  messagesContainer: {
    flex: 1,
    paddingTop: 10,
    marginTop: 50,
  },
  greetingText: {
    fontFamily: "Futura Md BT, sans-serif",
    fontWeight: 400,
    fontSize: 35,
    color: "#333",
    marginBottom: 20,
  },
  botMessage: {
    backgroundColor: "#E8E2D1",
    padding: 12,
    paddingTop: 15,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "flex-start",
    maxWidth: "80%",
    color: "#333",
  },
  userMessage: {
    backgroundColor: "#666666", // Olive Green
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: "flex-end",
    maxWidth: "80%",
    color: "white",
  },
  inputContainer: {
    backgroundColor: "#202020",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  input: {
    flex: 1,
    color: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
    marginRight: 10,
  },
  iconButton: {
    borderRadius: 25,
    padding: 10,
    marginLeft: 8,
  },
  graphImage: {
    width: "100%",
    height: 200, // Adjust the height as needed
    resizeMode: "contain", // Or 'cover' depending on your needs
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    marginLeft: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
    width: 250, // Specifies the width of the button
    alignItems: "center", // Centers content horizontally
    justifyContent: "center", // Centers content vertically
  },
  buttonText: {
    color: "white", // Ensures the text inside the button is white for contrast
  },
  stickyBar: {
    position: "absolute", // Makes the bar stay in place
    top: 0, // Positions the bar at the bottom of the screen
    left: 0,
    right: 0,
    backgroundColor: "#202020", // Gray color
    padding: 15,
    paddingTop: 40,
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
});
