import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";

import colors from "../constans/colors";

const Input = (props) => {

  const onChangeText = text => {
    props.onInputChanged(props.id, text);
  }

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
          {...props}
          style={styles.textBox}
          placeholder={props.placeholder}
          keyboardType={props.keyboardType || "default"}
          onChangeText={onChangeText}
          value={props.value}
        />
      </View>
      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    widht: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
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
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
});

export default Input;
