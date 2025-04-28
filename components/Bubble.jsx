import React, { use, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";

import colors from "../constans/colors";
import { useSelector } from "react-redux";

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
  const storedUsers = useSelector((state) => state.users.storedUsers);

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
    case "reply":
      bubbleStyle.backgroundColor = "#F2F2F2";
      bubbleStyle.paddingVertical = 3;
      bubbleStyle.paddingHorizontal = 6;
      bubbleStyle.borderLeftWidth = 4;
      bubbleStyle.borderLeftColor = colors.primaryColor;
      bubbleStyle.marginBottom = 5;
      textStyle.fontSize = 12;
      textStyle.color = "gray";
      break;

    default:
      break;
  }

  const copyToClickboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const replayingToUser =
    props.replayingTo && storedUsers[props.replayingTo.sentBy];

  return (
    <View style={wrapperStyle}>
      <Container
        style={{ width: "100%" }}
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
      >
        <View style={bubbleStyle}>
          {replayingToUser && (
            <View style={styles.replyPreview}>
              <Text style={styles.replyPreviewText} numberOfLines={2}>
              {props.replayingTo?.text && <Text>{props.replayingTo.text}</Text>}
              {!props.replayingTo?.text && props.replayingTo?.imageUrl && <Text>📷 Sent a photo</Text>}
              </Text>
            </View>
          )}

          {!props.imageUrl && <Text style={textStyle}>{text}</Text>}

          {props.imageUrl && (
            <Image source={{ uri: props.imageUrl }} style={styles.image} />
          )}
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
                onSelect={props.setReplay}
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
  replyContainer: {
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  replyPreview: {
    backgroundColor: "#F2F2F2",
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryColor,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginBottom: 5,
    alignSelf: "stretch",
  },
  replyPreviewText: {
    fontFamily: "regular",
    fontSize: 12,
    color: "gray",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 5,
  },
});

export default Bubble;
