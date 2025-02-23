import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, MaterialIcons } from '@expo/vector-icons'; // Or other icon library
import { useFonts } from 'expo-font';
import Circle from '@/components/Circle';

/*************  ✨ Codeium Command 🌟  *************/

export default function ChatBot() {
  const router = useRouter();
  
  const [messages, setMessages] = useState([
    { text: "Hi Ashley, welcome to GluDaily! What do you want to eat today?", sender: 'bot' },
    { text: "Hi Kayna, Your current Blood Sugar Level is Ideal.", sender: 'bot' },
  ]);

  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
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
  const sendMessage = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, { text: inputText, sender: 'user' }]);
      setInputText('');
      // Optionally, send the message to your backend here.
    }
  };



  const Graph = () => (
    <Image
      source={{ uri: 'https://i.imgur.com/your_graph_image.png' }} // Replace with your graph image URL
      style={styles.graphImage}
    />
  );



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8EF' }}>
      <View style={{position: 'absolute', top: -700, left: 500, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          {Array.from({length: 10}).map((_, i) => (
            <Circle
              key={i}
              style={{position: 'absolute'}}
              size={400 - i * 30}

              borderWidth={1} // Starts at 10 and decreases by 1 for each subsequent circle
            />
          ))}
        </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} // Adjust as needed
      >

       <TouchableOpacity onPress={() => router.replace('/LiveDataPage')} >
               <Text >Start</Text>
             </TouchableOpacity>


    

        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
      
          showsVerticalScrollIndicator={false}
        >
          
          <View style={{ padding: 20 }}>
            
            
            {/* Static Content and initial bot messages */}
            <Text style={styles.greetingText } >Hi Ashley, what do you want to eat today?</Text>
            {messages.map((message, index) => (
              message.sender === 'bot' && index === 1 ? (
                <React.Fragment key={index}>
                  <Text style={styles.botMessage}>{message.text}</Text>
                </React.Fragment>
              ) : message.sender === 'bot' ? (
                <Text key={index} style={styles.botMessage}>{message.text}</Text>
              ) : (
                <Text key={index} style={styles.userMessage}>{message.text}</Text>
              )
            ))}
          </View>
        </ScrollView>
        <View style={[styles.inputContainer, { paddingBottom: keyboardVisible ? insets.bottom : 0 }]}>
          <TextInput
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
    </SafeAreaView>
  );
}
/******  0810ac22-2e32-4e17-ad59-f7f5a9c3cc11  *******/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8EF',
  },
  messagesContainer: {
    flex: 1,
    paddingTop: 10,
  },
  greetingText: {
    fontFamily: 'Futura Md BT, sans-serif',
    fontWeight: 400,
    fontSize: 35,
    color: '#333',
    marginBottom: 20 
  },
  botMessage: {
    backgroundColor: '#E8E2D1',
    padding: 12,
    paddingTop:15,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    color: '#333',
  },
  userMessage: {
    backgroundColor: '#666666', // Olive Green
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    color: 'white',
  },
  inputContainer: {
    backgroundColor: '#202020',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 40,
  },
  
  input: {
    flex: 1,
    color: 'white',
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
    width: '100%',
    height: 200, // Adjust the height as needed
    resizeMode: 'contain', // Or 'cover' depending on your needs
    marginBottom: 15,
  },
});