// circle.tsx
import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

interface CircleProps {
  size: number;
  style?: StyleProp<ViewStyle>;
  borderWidth?: number;
  borderColor?: string;
}

const Circle: React.FC<CircleProps> = ({ size, style, borderWidth = 2, borderColor = 'black' }) => {
  return (
    <View style={[styles.base(size, borderWidth, borderColor), style]} />
  );
};

const styles = {
  /**
   * Styles for a circle component.
   * @param {number} size The size of the circle.
   * @param {number} borderWidth The width of the border.
   * @param {string} borderColor The color of the border.
   * @returns {ViewStyle} The styles for the circle component.
   */
  base: (size: number, borderWidth: number, borderColor: string): ViewStyle => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: borderWidth,
    borderColor: borderColor,
  }),
};

export default Circle;
