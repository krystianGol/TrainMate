import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const ChatListScreen = () => {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>ChatListScreen</Text>
      <Button title="Go to chat screen" onPress={() => navigation.navigate("ChatScreen")} />
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