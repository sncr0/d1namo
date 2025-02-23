import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const MyLineChart = () => {
  const [data, setData] = useState({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [50, 10, 40, 95, 85, 91]
      }
    ]
  });

  // Mock data update
  useEffect(() => {
    const interval = setInterval(() => {
      setData(previousData => {
        const newData = previousData.datasets[0].data.map(
          x => Math.floor(Math.random() * 100)
        );
        return {
          labels: previousData.labels,
          datasets: [{ data: newData }]
        };
      });
    }, 1000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text>Real-Time Line Chart</Text>
      <LineChart
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={{
          
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726'
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
}

export default MyLineChart;
