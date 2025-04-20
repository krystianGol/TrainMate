import { ScrollView, TouchableOpacity, Text } from "react-native";
import React, { useState, useReducer, useCallback } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import Input from "./Input";
import LabeledSlider from "./LabeledSlider";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";

const initialState = {
  inputValues: {
    firstName: "",
    lastName: "",
    clubName: "",
    city: "",
    email: "",
    password: "",
    experience: 0,
    fights: 0,
    weight: 0,
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    clubName: false,
    city: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};


const SignUp = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatch({ inputValue, inputId, validationResult: result });
    },
    [dispatch]
  );

  const onSliderChange = (id, value) => {
    dispatch({
      inputId: id,
      inputValue: value,
      validationResult: undefined,
    });
  };

  const authHandler = () => {
    signUp(
      state.inputValues.firstName,
      state.inputValues.lastName,
      state.inputValues.clubName,
      state.inputValues.city,
      state.inputValues.email,
      state.inputValues.password,
      state.inputValues.experience,
      state.inputValues.fights,
      state.inputValues.weight
    );
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
        errorText={state.inputValidities["firstName"]}
        value={state.inputValues["firstName"]}
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
        errorText={state.inputValidities["lastName"]}
        value={state.inputValues["lastName"]}
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
        errorText={state.inputValidities["clubName"]}
        value={state.inputValues["clubName"]}
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
        errorText={state.inputValidities["city"]}
        value={state.inputValues["city"]}
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
        errorText={state.inputValidities["email"]}
        value={state.inputValues["email"]}
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
        errorText={state.inputValidities["password"]}
        value={state.inputValues["password"]}
      />

      <LabeledSlider
        id="experience"
        label="Boxing internship (years)"
        min={0}
        max={30}
        value={state.inputValues.experience}
        onChange={(value) => onSliderChange("experience", value)}
      />

      <LabeledSlider
        id="fights"
        label="Number of fights"
        min={0}
        max={50}
        value={state.inputValues.fights}
        onChange={(value) => onSliderChange("fights", value)}
      />

      <LabeledSlider
        id="weight"
        label="Weight (kg)"
        min={30}
        max={120}
        value={state.inputValues.weight}
        onChange={(value) => onSliderChange("weight", value)}
      />

      <SubmitButton
        title="Sign Up"
        onPress={authHandler}
        disabled={!state.formIsValid}
      />
    </>
  );
};

export default SignUp;
