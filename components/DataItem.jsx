import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";

import ProfileImage from "./ProfileImage";

const DataItem = (props) => {
  return (
    <TouchableWithoutFeedback>
    <View style={styles.dataContainer}>
      <ProfileImage 
        image={props.profilePicture} 
        height={50}
        width={50}
        newChat={true}
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>
          {props.firstName} {props.lastName}
        </Text>
        <Text style={styles.subText}>
          {props.city} {props.clubName ? `• ${props.clubName}` : ''}
        </Text>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.3
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    letterSpacing: 0.3
  },
});

export default DataItem;
