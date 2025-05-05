import { ActivityIndicator, StyleSheet, View, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { child, getDatabase, ref, onValue, off, get } from "firebase/database";

import ChatListScreen from "../screens/ChatListScreen";
import CalendarScreen from "../screens/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../utils/firebaseHelper";
import { setStoredUsers } from "../store/userSlice";
import { setChatsData } from "../store/chatSlice";
import colors from "../constans/colors";
import { setChatMessages } from "../store/messagesSlice";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="ChatList"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundColor,
        },
        tabBarActiveTintColor: colors.primaryColor,
      }}
    >
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: "Calendar",
          tabBarLabel: "Calendar",
          tabBarIcon: () => (
            <FontAwesome
              name="calendar-check-o"
              size={24}
              color={colors.primaryColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          title: "Chats",
          tabBarLabel: "Chats",
          tabBarIcon: () => (
            <Ionicons
              name="chatbubbles-outline"
              size={24}
              color={colors.primaryColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <FontAwesome name="user-o" size={24} color={colors.primaryColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerBackTitle: "Back",
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: "containedModal" }}>
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigator = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const refs = [];
    try {
      const app = getFirebaseApp();
      const db = ref(getDatabase(app));
      const userChatsRef = child(db, `userChats/${userData.userId}`);
      refs.push(userChatsRef);

      onValue(userChatsRef, (snapshot) => {
        const chatIdsData = snapshot.val() || {};
        const chatIds = Object.values(chatIdsData);

        const chatsData = {};
        let chatsCounter = 0;

        for (let i = 0; i < chatIds.length; i++) {
          const chatId = chatIds[i];
          const chatRef = child(db, `chats/${chatId}`);
          refs.push(chatRef);

          onValue(chatRef, (chatSnapshot) => {
            chatsCounter += 1;
            const data = chatSnapshot.val();
            if (data) {
              data.key = chatSnapshot.key;

              data.users.forEach((userId) => {
                if (storedUsers[userId]) return;

                const userRef = child(db, `users/${userId}`);
                get(userRef).then((userSnapshot) => {
                  const userSnapshotData = userSnapshot.val();
                  dispatch(setStoredUsers({ newUsers: { userSnapshotData } }));
                });
                refs.push(userRef);
              });
              chatsData[chatSnapshot.key] = data;
            }
            if (chatsCounter >= chatIds.length) {
              dispatch(setChatsData({ chatsData }));
              setIsLoading(false);
            }
          });
          const messagesRef = child(db, `messages/${chatId}`);
          refs.push(messagesRef);

          onValue(messagesRef, (messagesSnapshot) => {
            const messagesData = messagesSnapshot.val();
            dispatch(setChatMessages({ chatId, messagesData }));
          });
          if (chatsCounter === 0) {
            setIsLoading(false);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
    return () => {
      refs.forEach((ref) => off(ref));
    };
  }, []);

  if (isLoading) {
    <View style={styles.indicatorContainer}>
      <ActivityIndicator
        size={"large"}
        color={colors.primaryColor}
        style={{ marginTop: 15 }}
      />
    </View>;
  }

  return <StackNavigator />;
};
const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainNavigator;
