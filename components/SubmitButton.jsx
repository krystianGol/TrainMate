import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import colors from "../constans/colors"

const SubmitButton = (props) => {

  const enabledColor = props.color || "#ffbf00";
  const disabledColor = colors.darkerPrimaryColor;
  const bgColor = props.disabled ? disabledColor : enabledColor;

  return (
    <TouchableOpacity 
        style={{
          ...styles.buttonStyle,
          ...props.style,
          ...{backgroundColor: bgColor}
        }}
        onPress={props.disabled ? () => {} : props.onPress}>
        <Text style={{ color: props.disabled ? colors.grey : "black"}}>{props.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: colors.primaryColor,
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