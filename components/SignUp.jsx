import { ScrollView, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from '@expo/vector-icons/EvilIcons';

import Input from "./Input";
import LabeledSlider from "./LabeledSlider";
import SubmitButton from "./SubmitButton";

const SignUp = () => {
  const [experience, setExperience] = useState(3);
  const [fights, setFights] = useState(0);
  const [weight, setWeight] = useState(30);

  return (
    <>
      <Input
        iconPack={FontAwesome}
        iconName="user-o"
        size={24}
        color="black"
        placeholder="Enter your first name"
        label="First Name"
      />

      <Input
        iconPack={FontAwesome}
        iconName="user-o"
        size={24}
        color="black"
        placeholder="Enter your second name"
        label="Second Name"
      />

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

      <Input
        iconPack={FontAwesome}
        iconName="home"
        size={24}
        color="black"
        placeholder="Enter the name of your boxing club"
        label="Boxing Club"
        autoCapitalize="none"
      />

      <Input
        iconPack={EvilIcons}
        iconName="location"
        size={24}
        color="black"
        placeholder="Enter your city"
        label="City"
        autoCapitalize="none"
      />

      <LabeledSlider
        label="Staż bokserski (lata)"
        min={0}
        max={30}
        value={experience}
        onChange={setExperience}
      />

      <LabeledSlider
        label="Liczba walk"
        min={0}
        max={50}
        value={fights}
        onChange={setFights}
      />

      <LabeledSlider
        label="Waga (kg)"
        min={30}
        max={120}
        value={weight}
        onChange={setWeight}
      />

      <SubmitButton title="Sign Up" onPress={() => console.log("pressed")} />
    </>
  );
};


export default SignUp;
