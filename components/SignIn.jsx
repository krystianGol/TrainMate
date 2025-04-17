import { View, Text } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

import Input from "./Input";

const SignIn = () => {
  return (
    <View>
      <Input
        iconPack={Fontisto}
        iconName="email"
        size={24}
        color="black"
        placeholder="Enter your email"
        label="Email"
        keyboardType="email-address"
      />

      <Input
        iconPack={AntDesign}
        iconName="lock"
        size={24}
        color="black"
        placeholder="Enter your password"
        label="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />
    </View>
  );
};

export default SignIn;
