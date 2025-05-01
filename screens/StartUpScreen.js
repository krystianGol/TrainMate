import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setDidTryAutoLogin, authenticate } from "../store/authSlice";
import { getUserData } from "../utils/actions/userActions";

import colors from "../constans/colors";

const StartUpScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem("userData");
      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin());
        return;
      }
      const parsedUserData = JSON.parse(storedAuthInfo);
      const {token, userId, expiryDate: expiryDateString} = parsedUserData;
      const expiryDate = new Date(expiryDateString);
      
      if (expiryDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const userData = await getUserData(userId);
      dispatch(authenticate({ token, userData}));

      dispatch()

    };
    tryLogin();
  }, []);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color={colors.primaryColor} />
    </View>
  );
};

export default StartUpScreen;
