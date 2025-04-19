import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import colors from "../constans/colors"

const SubmitButton = ({ title, onPress}) => {
  return (
    <TouchableOpacity 
        style={styles.buttonStyle}
        onPress={onPress}>
        <Text>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: 'red',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        marginHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SubmitButton