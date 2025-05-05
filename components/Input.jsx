import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";

import colors from "../constans/colors";

const Input = (props) => {
  const onChangeText = (text) => {
    props.onInputChanged(props.id, text);
  };

  return (
    <View style={styles.container}>
      {props.label && <Text style={styles.label}>{props.label}</Text>}
      <View style={[styles.inputContainer, props.inputContainerStyle]}>
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
          placeholderTextColor="#a7a6a6"
          keyboardType={props.keyboardType || "default"}
          onChangeText={onChangeText}
          value={props.value}
        />
      </View>
      {props.errorText && (
        <View style={[styles.errorContainer, props.errorContainerStyle]}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexBasis: "48%",
  },
  inputContainer: {
    flexDirection: "row",
    widht: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: colors.inputContainerColor,
    alignItems: "center",
    marginBottom: 17,
  },
  textBox: {
    color: "#a7a6a6",
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  icon: {
    marginRight: 15,
    color: "#a7a6a6",
  },
  label: {
    marginVertical: 5,
    fontFamily: "bold",
    letterSpacing: 0.3,
    color: colors.inputTextColor,
  },
  errorContainer: {
    marginLeft: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
});

export default Input;
