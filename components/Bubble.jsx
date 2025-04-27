import React, { use, useRef } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';

import colors from "../constans/colors";

const MenuItem = (props) => {
    const Icon = props.iconPack ?? Feather;
  
    return (
      <MenuOption onSelect={props.onSelect}>
        <View style={styles.menuItemContainer}>
          <Text style={styles.menuText}>{props.text}</Text>
          <Icon name={props.icon} size={18} />
        </View>
      </MenuOption>
    );
  };

const Bubble = (props) => {
  const { text, type } = props;

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());

  let Container = View;

  switch (type) {
    case "system":
      textStyle.color = "#65644A";
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      break;
    case "error":
      bubbleStyle.backgroundColor = colors.red;
      textStyle.color = "white";
      bubbleStyle.marginTop = 10;
      break;
    case "myMessage":
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = "#E7FED6";
      bubbleStyle.maxWidth = "90%";
      Container = TouchableWithoutFeedback;
      break;
    case "theirMessage":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.maxWidth = "90%";
      Container = TouchableWithoutFeedback;
      break;

    default:
      break;
  }

  const copyToClickboard = async (text) => {
    await Clipboard.setStringAsync(text);
  }

  return (
    <View style={wrapperStyle}>
      <Container
        style={{ width: "100%" }}
        onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)}
      >
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>
          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem 
                text="Copy"
                icon="copy"
                onSelect={() => copyToClickboard(text)}
              />
              <MenuItem 
                text="Replay"
                iconPack={Entypo}
                icon="arrow-with-circle-left"
                onSelect={() => console.log("replay")}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: "#E2DACC",
    borderWidth: 1,
  },
  text: {
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
  menuItemContainer: {
    flexDirection: "row",
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    fontSize: 16,
  },
});

export default Bubble;
