import React from 'react';
import { View, StyleSheet } from 'react-native';
import LiveGraph from '@/components/LiveGraph';

const LiveDataPage = () => {
  return (
    <View style={styles.container}>
      <LiveGraph />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8EF',
  },
});

export default LiveDataPage;