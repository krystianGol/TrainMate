import { View, Text } from "react-native";
import React, { useCallback, useReducer } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";

const initialState = {
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false
}

const SignIn = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const inputChanedHandler = useCallback((inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatch({ inputId, validationResult: result })
    }, [dispatch]);

  return (
    <>
      <Input
        id="email"
        iconPack={Fontisto}
        iconName="email"
        size={24}
        color="black"
        placeholder="Enter your email"
        label="Email"
        keyboardType="email-address"
        onInputChanged={inputChanedHandler}
        errorText={state.inputValidities['email']}
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
        onInputChanged={inputChanedHandler}
        errorText={state.inputValidities['password']}
      />

      <SubmitButton 
        title="Sign In"
        onPress={() => console.log('Pressed')}
        disabled={!state.formIsValid}
      />
    </>
  );
};

export default SignIn;
