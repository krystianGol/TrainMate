import { ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useReducer, useEffect, useState } from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";

import Input from "./Input";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authActions";
import colors from "../constans/colors";

const testMode = true;

const initialState = {
  inputValues: {
    email: testMode ? "krystian@gmail.com" : "",
    password: testMode ? "123456" : "",
  },
  inputValidities: {
    email: testMode,
    password: testMode,
  },
  formIsValid: testMode,
};

const SignIn = () => {
  const dispatch = useDispatch();

  const [state, dispatchForm] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchForm({ inputValue, inputId, validationResult: result });
    },
    [dispatchForm]
  );

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("An error occured", errorMessage);
    }
  }, [errorMessage]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(state.inputValues)

      const action = signIn(
        state.inputValues.email,
        state.inputValues.password
      );

      await dispatch(action);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [dispatch, state]);

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

      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primaryColor} style={{marginTop: 10}}/>
      ) : (
        <SubmitButton
          title="Sign In"
          onPress={authHandler}
          disabled={!state.formIsValid}
        />
      )}
    </>
  );
};

export default SignIn;
