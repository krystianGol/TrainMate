import { ScrollView, TouchableOpacity, Text } from "react-native";
import React, { useState, useReducer } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import Input from "./Input";
import LabeledSlider from "./LabeledSlider";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";


const reducer = (state, action) => {
  const {validationResult, inputId} = action;

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult,
  }

  let updatedFormIsValid = true;
  for (const key in updatedValidities) {
    if (updatedValidities[key] !== undefined) {
      updatedFormIsValid = false;
      break;
    }
  }

    return {
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
}

const initialState = {
  inputValidities: {
    firstName: false,
    lastName: false,
    clubName: false,
    city: false,
    email: false,
    password: false,
  },
  formIsValid: false
}

const SignUp = () => {
  const [experience, setExperience] = useState(3);
  const [fights, setFights] = useState(0);
  const [weight, setWeight] = useState(30);

  const [state, dispatch] = useReducer(reducer, initialState);

  const inputChangedHandler = (inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatch({ inputId, validationResult: result })
    };

  return (
    <>
      <Input
        id="firstName"
        iconPack={FontAwesome}
        iconName="user-o"
        size={24}
        color="black"
        placeholder="Enter your first name"
        label="First Name"
        onInputChanged={inputChangedHandler}
      />

      <Input
        id="lastName"
        iconPack={FontAwesome}
        iconName="user-o"
        size={24}
        color="black"
        placeholder="Enter your last name"
        label="Second Name"
        onInputChanged={inputChangedHandler}
      />

      <Input
        id="clubName"
        iconPack={FontAwesome}
        iconName="home"
        size={24}
        color="black"
        placeholder="Enter the name of your boxing club"
        label="Boxing Club"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
      />

      <Input
        id="city"
        iconPack={EvilIcons}
        iconName="location"
        size={24}
        color="black"
        placeholder="Enter your city"
        label="City"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
      />

      <Input
        id="email"
        iconPack={Fontisto}
        iconName="email"
        size={24}
        color="black"
        placeholder="Enter your email"
        label="Email"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
      />

      <Input
        id="password"
        iconPack={AntDesign}
        iconName="lock"
        size={24}
        color="black"
        placeholder="Enter your password"
        label="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
      />

      <LabeledSlider
        id="experience"
        label="Boxing internship (years)"
        min={0}
        max={30}
        value={experience}
        onChange={setExperience}
      />

      <LabeledSlider
        id="fights"
        label="Number of fights"
        min={0}
        max={50}
        value={fights}
        onChange={setFights}
      />

      <LabeledSlider
        id="weight"
        label="Weight (kg)"
        min={30}
        max={120}
        value={weight}
        onChange={setWeight}
      />

      <SubmitButton 
        title="Sign Up" 
        onPress={() => console.log("pressed")} 
        disabled={!state.formIsValid}
        />
    </>
  );
};

export default SignUp;
