import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback, useEffect } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSelector } from "react-redux";

import Bubble from "../components/Bubble";
import PageContainer from "../components/PageContainer";
import { createNewChat } from "../utils/actions/ChatActions";
import { sendTextMessage } from "../utils/actions/ChatActions";


const ChatScreen = (props) => {

  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);

  const storedUsers = useSelector(state => state.users.storedUsers);
  const storedChats = useSelector(state => state.chats.chatsData);
  const userData = useSelector(state => state.auth.userData);
  const messagesData = useSelector(state => state.messages.messagesData);
  console.log(messagesData);

  const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;


  const getChatTitleFromName = () => {
    const userIdToChatWith = chatData.users[0];
    const userDataToChatWith = storedUsers[userIdToChatWith]

    return `${userDataToChatWith.firstName} ${userDataToChatWith.lastName}`
  }

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    })
  }, [])

  const sendMessage = useCallback(async () => {

    try {
      let id = chatId;
      if (!id) {
        id = await createNewChat(userData.userId, chatData);
        setChatId(id);
      }
      await sendTextMessage(id, userData.userId, messageText);
    } catch (error) {
      console.log(error);
    }
    setMessageText("")
  }, [messageText])

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={110} style={{ flex: 1 }}>

      <PageContainer>
        { !chatId && (
          <Bubble 
            text="This is new Chat"
            type="system"
          />
        )}
      </PageContainer>

      <View style={styles.inputContainer}>
      <TouchableOpacity 
        style={styles.mediaButton}
        onPress={() => console.log("Pressed")}>
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
        <TextInput 
          style={styles.textBox}
          onChangeText={text => setMessageText(text)}
          value={messageText}
          onSubmitEditing={sendMessage}
          />
        {
          messageText === "" && 
          <TouchableOpacity 
          style={styles.mediaButton}>
          <Feather name="camera" size={24} color="black" />
        </TouchableOpacity>
        }
        {
          messageText !== "" && 
          <TouchableOpacity 
          style={styles.mediaButton}
          onPress={sendMessage}>
          <Feather name="send" size={24} color="black" />
        </TouchableOpacity>
        }
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: "8",
    paddingHorizontal: "10",
    height: 50,
    marginTop: "auto",
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: 10,
    paddingHorizontal: 12
  },
  mediaButton: {
    alignSelf: 'center'
  }
});

export default ChatScreen;
