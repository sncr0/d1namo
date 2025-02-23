import { StyleSheet } from 'react-native';
import { Colors } from './Colors'; // Correct the path as needed if it's not correct

export const ClassicStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Example background color
  },
  contentContainer: {
    position: 'absolute',
    padding: 20, // Adds space inside the container
    maxWidth: 300, // Maximum width of the container for text wrapping
    flex: 0, // Ensuring this container doesn't grow
    textAlign: 'left', // Align text components to the left
  },
  titleText: {
    color: '#000',
    fontFamily: 'Futura Md BT',
    fontSize: 65, // Converted from '65px' to 65
    fontStyle: 'normal',
    fontWeight: '600', // Use string for fontWeight in React Native
    lineHeight: 78, // An example value, adjust based on design requirements
  },
  circleStyle: {
    position: 'absolute',
    left: 50,
    top: 50,
    zIndex: 1,
    width: 300,  // Diameter of the circle
    height: 300, // Height must be the same as the width to form a perfect circle
    borderRadius: 150, // Half the size of the width/height
    justifyContent: 'center', // Centers the text vertically
    alignItems: 'center' // Centers the text horizontally
  },
  circleContainer: {
    width: 150, // Set the diameter of the circle
    height: 150, // Height must be the same as the width to form a perfect circle
    top: -400, // adjust this value to move the circle vertically
    left: -250,
    justifyContent: 'center', // center the circles horizontally
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 17,
    color: '#333', // Text color
  },
  button: {
    backgroundColor: '#fff', // white button background
    padding: 10,
    borderRadius: 10, // round edges
  },
  buttonText: {
    fontWeight: 'bold', // bold font
    fontStyle: 'normal', // normal font style
    color: '#000', // black text color
  },messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  botMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 17,
    color: '#333',
  },
  inputField: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  
});
