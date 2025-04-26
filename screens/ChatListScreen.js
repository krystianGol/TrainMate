import { StyleSheet, FlatList, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Entypo from '@expo/vector-icons/Entypo';
import { useSelector, useDispatch } from 'react-redux';
import DataItem from '../components/DataItem';

const ChatListScreen = (props) => {

    const selectedUser = props.route?.params?.selectedUserId;

    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);

    const userChats = useSelector(state => {
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
              iconName='new-message'
              iconSize={24}
              color='black'
              onPress={() => props.navigation.navigate("NewChat")}
            />
          </HeaderButtons>
        )
      })
    }, [])

    useEffect(() => {

      if (!selectedUser) {
        return;
      }

      const chatUsers = [selectedUser, userData.userId]

      const navigationProps = {
        newChatData: {users: chatUsers}
      }

      props.navigation.navigate("ChatScreen", navigationProps);
    }, [selectedUser])

  return (
    <FlatList 
      data={userChats}
      renderItem={(itemData) => {
        const otherUsersId = itemData.item.users.find(uid => uid !== userData.userId);
        const otherUser = storedUsers[otherUsersId];
        const chatId = itemData.item.key
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
          onPress={() => props.navigation.navigate("ChatScreen", {chatId})}
        />);
      }}
    />
  )
}

export default ChatListScreen