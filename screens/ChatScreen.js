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
import React, { useState, useCallback } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from '@expo/vector-icons/AntDesign';


const ChatScreen = () => {
  const [messageText, setMessageText] = useState("")

  const sendMessage = useCallback(() => {
    setMessageText("")
  }, [messageText])

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={110} style={{ flex: 1 }}>
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
