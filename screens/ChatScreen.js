import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSelector } from "react-redux";

import Bubble from "../components/Bubble";
import PageContainer from "../components/PageContainer";
import { createNewChat } from "../utils/actions/ChatActions";
import {
  sendTextMessage,
  sendImageMessage,
} from "../utils/actions/ChatActions";
import ReplayTo from "../components/ReplayTo";
import { lunchImagePicker, openCamera, uploadImageAsync } from "../utils/imagePickerHelper";

const ChatScreen = (props) => {
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [errorText, setErrorText] = useState("");
  const [replayingTo, setReplayingTo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tempImageUri, setTempImageUri] = useState();

  const flatList = useRef();

  if (replayingTo) {
    console.log(replayingTo.key);
  }

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const userData = useSelector((state) => state.auth.userData);

  const messagesData = useSelector((state) => {
    if (!chatId) return [];

    const chatMessagesData = state.messages.messagesData[chatId];

    if (!chatMessagesData) return [];

    const messageList = [];

    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({
        key,
        ...message,
      });
    }
    return messageList;
  });

  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

  const getChatTitleFromName = () => {
    const userIdToChatWith = chatData.users[0];
    const userDataToChatWith = storedUsers[userIdToChatWith];

    return `${userDataToChatWith.firstName} ${userDataToChatWith.lastName}`;
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });
  }, []);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);
    try {
      let id = chatId;

      if (!id) {
        id = await createNewChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      const currentReplayingTo = replayingTo;

      const result = await lunchImagePicker();
      const tempUri = result.uri;
      if (!tempUri) {
        setIsLoading(false);
        return;
      }
      setTempImageUri(tempUri);
      const uploadUri = await uploadImageAsync(tempUri, true);

      if (!uploadUri) {
        throw new Error("Could not upload image");
      }
      console.log(replayingTo)
      await sendImageMessage(
        chatId,
        userData.userId,
        uploadUri,
        currentReplayingTo && currentReplayingTo.key
      );
      setTempImageUri("");
      setReplayingTo();
    } catch (error) {
      setErrorText("Message failed to send");
      setTimeout(() => {
        setErrorText("")
      }, 2000)
      console.log(error);
    }
    setIsLoading(false);
  }, [replayingTo, chatId, tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const result = await openCamera();
      console.log(result)
      if (!result || result.cancelled) return;
      
      const tempUri = result.uri;
  
      setTempImageUri(tempUri);
  
      setIsLoading(true);
      let id = chatId;
      if (!id) {
        id = await createNewChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }
  
      const currentReplayingTo = replayingTo;
  
      const uploadUri = await uploadImageAsync(tempUri, true);
  
      if (!uploadUri) {
        throw new Error("Could not upload image");
      }
  
      await sendImageMessage(
        id,
        userData.userId,
        uploadUri,
        currentReplayingTo && currentReplayingTo.key
      );
  
      setTempImageUri("");
      setReplayingTo();
  
    } catch (error) {
      setErrorText("Message failed to send");
      setTimeout(() => {
        setErrorText("")
      }, 2000)
      console.log(error);
    }
    setIsLoading(false);
  }, [replayingTo, chatId]);

  const sendMessage = useCallback(async () => {
    try {
      let id = chatId;
      if (!id) {
        id = await createNewChat(userData.userId, chatData);
        setChatId(id);
      }
      await sendTextMessage(
        id,
        userData.userId,
        messageText,
        replayingTo && replayingTo.key
      );

      setMessageText("");
      setReplayingTo();
    } catch (error) {
      setErrorText("Message failed to send");
      setTimeout(() => {
        setErrorText("")
      }, 2000)
      console.log(error);
    }
    setMessageText("");
  }, [messageText]);

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={110}
        style={{ flex: 1 }}
      >
        <PageContainer>
          {!chatId && <Bubble text="This is new Chat" type="system" />}
          {errorText && <Bubble text={errorText} type="error" />}
          {messagesData && (
            <FlatList
              ref={(ref) => flatList.current = ref}
              onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false})}
              onLayout={() => flatList.current.scrollToEnd({ animated: false})}
              data={messagesData}
              renderItem={(itemData) => {
                const message = itemData.item;
                const senderId = message.sentBy;
                
                if (senderId === userData.userId) {
                  return (
                    <Bubble
                      type="myMessage"
                      text={message.text}
                      setReplay={() => setReplayingTo(message)}
                      replayingTo={
                        message.replayTo &&
                        messagesData.find((i) => i.key === message.replayTo)
                      }
                      imageUrl={message.imageUrl}
                    />
                  );
                } else {
                  return (
                    <Bubble
                      type="theirMessage"
                      text={message.text}
                      setReplay={() => setReplayingTo(message)}
                      replayingTo={
                        message.replayTo &&
                        messagesData.find((i) => i.key === message.replayTo)
                      }
                      imageUrl={message.imageUrl}
                    />
                  );
                }
              }}
            />
          )}
        </PageContainer>

        {replayingTo && (
          <ReplayTo
            text={replayingTo.text}
            user={storedUsers[replayingTo.sentBy]}
            onCancel={() => setReplayingTo()}
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={uploadImage}>
            <AntDesign name="plus" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.textBox}
            onChangeText={(text) => setMessageText(text)}
            value={messageText}
            onSubmitEditing={sendMessage}
          />
          {messageText === "" && (
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <Feather name="camera" size={24} color="black" />
            </TouchableOpacity>
          )}
          {messageText !== "" && (
            <TouchableOpacity style={styles.mediaButton} onPress={sendMessage}>
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 12,
  },
  mediaButton: {
    alignSelf: "center",
  },
});

export default ChatScreen;
