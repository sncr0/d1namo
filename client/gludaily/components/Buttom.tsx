import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter from expo-router


const MyButton = () => {
  const router = useRouter();  // Use useRouter instead of useNavigation

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/chatBot')} style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the button
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MyButton;
