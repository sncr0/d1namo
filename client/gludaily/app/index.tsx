import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors'; // Adjust this path if necessary
import { ClassicStyles } from '@/constants/Style'; // Import ClassicStyles from the correct location
import MyButton from '@/components/Buttom';
import Circle from '@/components/Circle';
import { useRouter } from 'expo-router';

const MyNewPage = () => {
  return (

    <View style={styles.container}>
      <View style={ClassicStyles.contentContainer}>
      <View style={{position: 'absolute', top: -600, left: -200, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          {Array.from({length: 10}).map((_, i) => (
            <Circle
              key={i}
              style={{position: 'absolute'}}
              size={400 - i * 30}

              borderWidth={1} // Starts at 10 and decreases by 1 for each subsequent circle
            />
          ))}
        </View>
        <View style={{position: 'absolute', top: 400, left: 300, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          {Array.from({length: 10}).map((_, i) => (
            <Circle
              key={i}
              style={{position: 'absolute'}}
              size={400 - i * 30}

              borderWidth={1} // Starts at 10 and decreases by 1 for each subsequent circle
            />
          ))}
        </View>
        <View style={{position: 'absolute', top:200, left: -500, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
          {Array.from({length: 6}).map((_, i) => (
            <Circle
              key={i}
              style={{position: 'absolute'}}
              size={200 - i * 30}

              borderWidth={10 - (i*0.5)} // Starts at 10 and decreases by 1 for each subsequent circle
            />
          ))}
        </View>
        <View style={{ flex: 1, position: 'relative' }}>  {/* Ensure the container is positioned relatively */}
        <Circle size={50} style={{ position: 'absolute', top: -200, left: 190 ,backgroundColor: 'black'}} />  {/* Positioned 10 units from the top and left of the container */}
        <Circle size={50} style={{ position: 'absolute', top: 300, left: 50 ,backgroundColor: 'black'}} />  {/* Positioned 10 units from the top and left of the container */}
      </View>
      
        <Text style={ClassicStyles.titleText}>GluDaily</Text>
        <Text style={ClassicStyles.bodyText}>
          AI doctor monitors your glucose level in your package.
        </Text>
        <MyButton />
        
      </View>

    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MyNewPage;
