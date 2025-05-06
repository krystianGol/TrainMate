import { StyleSheet, FlatList, Text, Modal } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Entypo from "@expo/vector-icons/Entypo";
import { useSelector, useDispatch } from "react-redux";
import DataItem from "../components/DataItem";
import { StatusBar } from "expo-status-bar";

import colors from "../constans/colors";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const existingChatId = props.route?.params?.chatId;

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            iconPack={Entypo}
            iconName="new-message"
            iconSize={24}
            color={colors.primaryColor}
            onPress={() => props.navigation.navigate("NewChat")}
          />
        </HeaderButtons>
      ),
    });
  }, []);

  if (existingChatId) {
    useEffect(() => {
      props.navigation.navigate("ChatScreen", { chatId: existingChatId });
    }, [existingChatId]);
  } else {
    useEffect(() => {
      if (!selectedUser) {
        return;
      }
      const chatUsers = [selectedUser, userData.userId];
      const navigationProps = {
        newChatData: { users: chatUsers },
      };
      props.navigation.navigate("ChatScreen", navigationProps);
    }, [selectedUser, userChats]);
  }

  return (
    <>
      <StatusBar style="light" />
      <FlatList
        style={styles.flatListStyle}
        data={userChats}
        renderItem={(itemData) => {
          const otherUsersId = itemData.item.users.find(
            (uid) => uid !== userData.userId
          );
          const otherUser = storedUsers[otherUsersId];
          const chatId = itemData.item.key;
          const latestMessage = itemData.item.latestMessageText || "New chat";

          if (!otherUser) {
            return;
          }
          return (
            <DataItem
              firstName={otherUser.firstName}
              lastName={otherUser.lastName}
              profilePicture={otherUser.profilePicture}
              chatListScreen={true}
              latestMessage={latestMessage}
              onPress={() =>
                props.navigation.navigate("ChatScreen", { chatId })
              }
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flatListStyle: {
    backgroundColor: colors.backgroundColor,
  },
});

export default ChatListScreen;
