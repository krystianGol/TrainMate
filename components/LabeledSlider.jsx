import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const LabeledSlider = ({ label, min, max, step = 1, value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}: {value}
      </Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        minimumTrackTintColor="#e11d48"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#e11d48"
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
      fontFamily: 'bold'
    },
  });

export default LabeledSlider