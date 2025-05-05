import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import colors from '../constans/colors';

const LabeledSlider = ({ label, min, max, step = 1, value, onChange, subLabel }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}: {value} {subLabel}
      </Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor="#ffc900"
        maximumTrackTintColor="#ffc900"
        thumbTintColor="#ffc900"
        value={value}
        onValueChange={onChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      marginVertical: 20,
      paddingHorizontal: 16,
    },
    label: {
      marginBottom: 8,
      fontFamily: 'bold',
      color: colors.textColor,
    },
  });

export default LabeledSlider