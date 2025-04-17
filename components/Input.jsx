import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

import colors from "../constans/colors";

const Input = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        <props.iconPack
          style={styles.icon}
          name={props.iconName}
          size={props.size || 20}
          color={props.color}
        />
        <TextInput 
         { ...props }
         style={styles.textBox} 
         placeholder={props.placeholder} 
         keyboardType={props.keyboardType || 'default'}
         />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginHorizontal: 10
  },
  inputContainer: {
    flexDirection: "row",
    widht: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginRight: 20,
    borderRadius: 2,
    backgroundColor: colors.nearlyWhite,
    alignItems: "center",
  },
  textBox: {
    color: colors.textColor,
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  icon: {
    marginRight: 15,
    color: colors.grey,
  },
  label: {
    marginVertical: 8,
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
});

export default Input;
