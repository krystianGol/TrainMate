import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";

import ProfileImage from "./ProfileImage";
import colors from "../constans/colors";

const DataItem = (props) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.dataContainer}>
        <ProfileImage
          uri={props.profilePicture}
          height={65}
          width={65}
          newChat={true}
        />
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {props.firstName} {props.lastName}
          </Text>

          {!props.chatListScreen ? (
            <>
              <Text style={styles.subText}>
                {props.city} {props.clubName ? `• ${props.clubName}` : ""}
              </Text>
              <Text style={styles.subText}>
                Boxing: {props.experience} yrs • {props.fights} fights • {props.weight}kg
              </Text>
            </>
          ) : (
            <>
              {props.latestMessage && (
                <Text style={styles.subText} numberOfLines={1}>
                  {props.latestMessage}
                </Text>
              )}
            </>
          )}
          
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
    marginBottom: 5,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  nameText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 0.3,
  },
  subText: {
    fontSize: 15,
    color: "grey",
    marginTop: 2,
    letterSpacing: 0.3,
  },
});

export default DataItem;
