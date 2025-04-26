import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import Input from "../components/Input";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PageContainer from "../components/PageContainer";
import colors from "../constans/colors";
import NoUsersFound from "../components/NoUsersFound";
import StartSearchHint from "../components/StartSearchHint";
import { searchUsers } from "../utils/actions/userActions";
import DataItem from "../components/DataItem";
import { useSelector, useDispatch } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { setStoredUsers } from "../store/userSlice";

const NewChatScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultFound, setNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item title="Close" onPress={() => props.navigation.goBack()} />
        </HeaderButtons>
      ),
      headerTitle: "New Chat",
    });
  }, []);

  useEffect(() => {
    const delayTime = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers();
        setNoResultFound(false);
        return;
      }

      setIsLoading(true);
      const usersResult = await searchUsers(searchTerm);
      delete usersResult[userData.userId]
      setUsers(usersResult);

      if (Object.keys(usersResult).length === 0) {
        setNoResultFound(true);
      } else {
        setNoResultFound(false);

        dispatch(setStoredUsers({ newUsers: usersResult }));
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delayTime);
  }, [searchTerm]);

  const handlePress = (userId) => {
    props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "Home",
                state: {
                  routes: [
                    {
                      name: "ChatList",
                      params: { selectedUserId: userId },
                    },
                  ],
                },
              },
            ],
          })
        );
  }

  return (
    <PageContainer>
      <View style={styles.inputContainer}>
        <FontAwesome
          style={styles.icon}
          name="search"
          size={20}
          color="black"
        />
        <TextInput
          style={styles.textBox}
          placeholder="Search for user"
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>
      {!isLoading && !noResultFound && users && (
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];
            return (
              <DataItem
                firstName={userData.firstName}
                lastName={userData.lastName}
                profilePicture={userData.profilePicture}
                city={userData.city}
                clubName={userData.clubName}
                experience={userData.experience}
                fights={userData.fights}
                weight={userData.weight}
                onPress={() => handlePress(userData.userId)}
              />
            )
          }}
        />
      )}
      {isLoading && (
        <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={colors.primaryColor} />
        </View>
      )}
      {!isLoading && (!users || noResultFound) && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {!users && <StartSearchHint />}
          {noResultFound && <NoUsersFound />}
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 8,
    borderRadius: 2,
    backgroundColor: colors.nearlyWhite,
    alignItems: "center",
  },
  textBox: {
    color: colors.textColor,
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    paddingTop: 0,
  },
  icon: {
    marginRight: 15,
    color: colors.grey,
  },
});

export default NewChatScreen;
