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
import { Feather, MaterialIcons } from "@expo/vector-icons"; // Or other icon library
import { useFonts } from "expo-font";
import Circle from "@/components/Circle";

/*************  ✨ Codeium Command 🌟  *************/

export default function ChatBot() {
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      text: "Hi Ashley, welcome to GluDaily! What do you want to eat today?",
      sender: "bot",
    },
  ]);

  const [session_id, setSession_id] = useState(null);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
  const sendMessage = async () => {
    if (inputText.trim() !== "") {
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");
      inputRef.current?.focus(); // Refocus the input field
      // Optionally, send the message to your backend here.
      const ipAddress = "10.253.132.164";
      const uri = `http://${ipAddress}:8000/chatbot/chat`;
      console.log(session_id);
      console.log(inputText);
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.response, sender: "bot" },
      ]);
    }
  };

  const Graph = () => (
    <Image
      source={{ uri: "https://i.imgur.com/your_graph_image.png" }} // Replace with your graph image URL
      style={styles.graphImage}
    />
  );

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
            <Text style={styles.greetingText}>
              Hi Ashley, what do you want to eat today?
            </Text>
            {messages.map((message, index) =>
              message.sender === "bot" && index === 1 ? (
                <React.Fragment key={index}>
                  <Text style={styles.botMessage}>{message.text}</Text>
                </React.Fragment>
              ) : message.sender === "bot" ? (
                <Text key={index} style={styles.botMessage}>
                  {message.text}
                </Text>
              ) : (
                <Text key={index} style={styles.userMessage}>
                  {message.text}
                </Text>
              )
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
      <View style={styles.stickyBar}>
        <TouchableOpacity onPress={() => router.replace("/LiveDataPage")}>
          <Text style={styles.buttonText}>
            What does my blood sugar look like?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
/******  0810ac22-2e32-4e17-ad59-f7f5a9c3cc11  *******/

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
    backgroundColor: "black", // Gray color
    padding: 15,
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
  },
});
