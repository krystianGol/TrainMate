import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
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
import {
  lunchImagePicker,
  openCamera,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import defaultProfilePicture from "../constans/images/userImage.jpeg";
import colors from "../constans/colors";

const ChatScreen = (props) => {
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [errorText, setErrorText] = useState("");
  const [replayingTo, setReplayingTo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tempImageUri, setTempImageUri] = useState();
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false);

  const flatList = useRef();

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const userData = useSelector((state) => state.auth.userData);

  const messagesData = useSelector(
    (state) => {
      if (!chatId) return [];

      const chatMessagesData = state.messages.messagesData[chatId];
      if (!chatMessagesData) return [];

      return Object.entries(chatMessagesData).map(([key, message]) => ({
        key,
        ...message,
      }));
    },
    [chatId]
  );

  const memoizedMessagesData = useMemo(() => {
    return messagesData;
  }, [messagesData]);

  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

  const userDataToChatWith = storedUsers[chatData.users[0]];

  const getChatTitleFromName = () => {
    return `${userDataToChatWith.firstName} ${userDataToChatWith.lastName}`;
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: () => (
        <TouchableWithoutFeedback onPress={() => setUserInfoModalVisible(true)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 1, 
            }}
          >
            <Image
              source={
                userDataToChatWith.profilePicture
                  ? { uri: userDataToChatWith.profilePicture }
                  : defaultProfilePicture
              }
              style={styles.chatScreenProfileImage}
            />
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              {getChatTitleFromName()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      ),
    });
  }, [props.navigation]);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);
    try {
      let id = chatId;

      if (!id) {
        id = await createNewChat(
          userData.userId,
          props.route.params.newChatData
        );
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
        setErrorText("");
      }, 2000);
      console.log(error);
    }
    setIsLoading(false);
  }, [replayingTo, chatId, tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const result = await openCamera();

      if (!result || result.cancelled) return;

      const tempUri = result.uri;

      setTempImageUri(tempUri);

      setIsLoading(true);
      let id = chatId;
      if (!id) {
        id = await createNewChat(
          userData.userId,
          props.route.params.newChatData
        );
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
        setErrorText("");
      }, 2000);
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
        setErrorText("");
      }, 2000);
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
              ref={(ref) => (flatList.current = ref)}
              onContentSizeChange={() =>
                flatList.current.scrollToEnd({ animated: false })
              }
              onLayout={() => flatList.current.scrollToEnd({ animated: false })}
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
          {userInfoModalVisible && (
            <Modal
              visible={userInfoModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setUserInfoModalVisible(false)}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPressOut={() => setUserInfoModalVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: colors.inputContainerColor,
                    padding: 20,
                    borderRadius: 15,
                    alignItems: "center",
                    width: "80%",
                    maxWidth: 350,
                  }}
                >
                  <Image
                    source={
                      userDataToChatWith.profilePicture
                        ? { uri: userDataToChatWith.profilePicture }
                        : defaultProfilePicture
                    }
                    style={styles.modalProfileImage}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: 'white',
                      marginBottom: 10,
                    }}
                  >
                    {getChatTitleFromName()}
                  </Text>
                  <Text style={styles.modalUserInfoText}>
                    {userDataToChatWith.city}
                  </Text>
                  <Text style={styles.modalUserInfoText}>
                    {userDataToChatWith.clubName}
                  </Text>
                  <Text style={styles.modalUserInfoText}>
                    Boks: {userDataToChatWith.experience} lata •{" "}
                    {userDataToChatWith.fights} walk •{" "}
                    {userDataToChatWith.weight}kg
                  </Text>
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: "#ccc",
                      marginVertical: 20,
                      width: "100%",
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setUserInfoModalVisible(false)}
                  >
                    <Text style={{ color: colors.primaryColor, fontWeight: "bold" }}>
                      Zamknij
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
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
            <AntDesign name="plus" size={24} color={colors.primaryColor} />
          </TouchableOpacity>
          <TextInput
            style={styles.textBox}
            onChangeText={(text) => setMessageText(text)}
            value={messageText}
            onSubmitEditing={sendMessage}
          />
          {messageText === "" && (
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <Feather name="camera" size={24} color={colors.primaryColor} />
            </TouchableOpacity>
          )}
          {messageText !== "" && (
            <TouchableOpacity style={styles.mediaButton} onPress={sendMessage}>
              <Feather name="send" size={24} color={colors.primaryColor} />
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
    backgroundColor: "#131314",
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
    backgroundColor: "#1d1c1c",
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: 10,
    paddingHorizontal: 12,
    color: "white",
  },
  mediaButton: {
    alignSelf: "center",
  },
  chatScreenProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 17.5,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  modalUserInfoText: {
    letterSpacing: 0.3,
    color: "#929292",
    textAlign: "center",
  },
});

export default ChatScreen;
