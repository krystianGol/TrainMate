import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";

import colors from "../constans/colors";

const ReplyTo = (props) => {
  const { text, user, onCancel } = props;
  const name = `${user.firstName} ${user.lastName}`;
  console.log(text);
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
        <Text numberOfLines={1} style={{ color: "white" }}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
          <Fontisto name="close" size={24} color={colors.primaryColor} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1d1c1c",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderLeftColor: colors.primaryColor,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    color: colors.primaryColor,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
});

export default ReplyTo;
