import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Entypo from '@expo/vector-icons/Entypo';
import { useSelector } from 'react-redux';

const ChatListScreen = (props) => {

    const selectedUser = props.route?.params?.selectedUserId;
    const userData = useSelector(state => state.auth.userData)
    
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
    <View style={styles.container}>
      <Text>ChatListScreen</Text>
      <Button title="Go to chat screen" onPress={() => props.navigation.navigate("ChatScreen")} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ChatListScreen