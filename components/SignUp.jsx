import {
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Text,
} from "react-native";
import React, { useState, useReducer, useCallback, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useDispatch } from "react-redux";

import Input from "./Input";
import LabeledSlider from "./LabeledSlider";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";
import colors from "../constans/colors";
import logo from "../constans/images/logo2.png";

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
    weight: 30,
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
  const [state, dispatchForm] = useReducer(reducer, initialState);
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchForm({ inputValue, inputId, validationResult: result });
    },
    [dispatchForm]
  );

  const onSliderChange = (id, value) => {
    dispatchForm({
      inputId: id,
      inputValue: value,
      validationResult: undefined,
    });
  };

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const action = signUp(
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
      await dispatch(action);
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }, [dispatch, state]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("An error occured", errorMessage);
    }
  }, [errorMessage]);

  return (
    <View style={{ backgroundColor: colors.backgroundColor }}>
      <Image style={styles.logoImage} source={logo} />
      <Text style={styles.signUpLabel}>Zarejestruj się</Text>
      <View style={styles.rowContainer}>
        <Input
          id="firstName"
          iconPack={FontAwesome}
          iconName="user-o"
          size={24}
          color="black"
          placeholder="Imie"
          onInputChanged={inputChangedHandler}
          errorText={state.inputValidities["firstName"]}
          value={state.inputValues["firstName"]}
          inputContainerStyle={{ marginRight: 4, marginLeft: 10 }}
          errorContainerStyle={{ marginLeft: 10, marginHorizontal: 10 }}
        />

        <Input
          id="lastName"
          iconPack={FontAwesome}
          iconName="user-o"
          size={24}
          color="black"
          placeholder="Nazwisko"
          onInputChanged={inputChangedHandler}
          errorText={state.inputValidities["lastName"]}
          value={state.inputValues["lastName"]}
          inputContainerStyle={{ marginLeft: 4, marginRight: 10 }}
          errorContainerStyle={{ marginLeft: 5 }}
        />
      </View>
      <Input
        id="clubName"
        iconPack={FontAwesome}
        iconName="home"
        size={24}
        color="black"
        placeholder="Klub Bokserski"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={state.inputValidities["clubName"]}
        value={state.inputValues["clubName"]}
        inputContainerStyle={{ marginHorizontal: 20 }}
        errorContainerStyle={{ marginLeft: 22 }}
      />

      <Input
        id="city"
        iconPack={EvilIcons}
        iconName="location"
        size={24}
        color="black"
        placeholder="Miasto"
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={state.inputValidities["city"]}
        value={state.inputValues["city"]}
        inputContainerStyle={{ marginHorizontal: 20 }}
        errorContainerStyle={{ marginLeft: 22 }}
      />

  <View style={styles.rowContainer}>
  <Input
        id="email"
        iconPack={Fontisto}
        iconName="email"
        size={24}
        color="black"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
        errorText={state.inputValidities["email"]}
        value={state.inputValues["email"]}
        inputContainerStyle={{ marginRight: 4, marginLeft: 10 }}
        errorContainerStyle={{ marginLeft: 10, marginHorizontal: 10 }}
      />

      <Input
        id="password"
        iconPack={AntDesign}
        iconName="lock"
        size={24}
        color="black"
        placeholder="Hasło"
        secureTextEntry={true}
        autoCapitalize="none"
        onInputChanged={inputChangedHandler}
        errorText={state.inputValidities["password"]}
        value={state.inputValues["password"]}
        inputContainerStyle={{ marginLeft: 4, marginRight: 10 }}
        errorContainerStyle={{ marginLeft: 5 }}
      />
  </View>


      <LabeledSlider
        id="experience"
        label="Staż Bokerski"
        subLabel="Lat"
        min={0}
        max={30}
        value={state.inputValues.experience}
        onChange={(value) => onSliderChange("experience", value)}
      />

      <LabeledSlider
        id="fights"
        label="Liczba walk"
        min={0}
        max={50}
        value={state.inputValues.fights}
        onChange={(value) => onSliderChange("fights", value)}
      />

      <LabeledSlider
        id="weight"
        label="Waga"
        subLabel="kg"
        min={30}
        max={120}
        value={state.inputValues.weight}
        onChange={(value) => onSliderChange("weight", value)}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primaryColor} />
      ) : (
        <SubmitButton
          title="Utwórz konto"
          onPress={authHandler}
          disabled={!state.formIsValid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    width: 280,
    height: 180,
    alignSelf: "center",
    marginBottom: 0,
  },
  signUpLabel: {
    color: colors.textColor,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 35,
    fontSize: 45,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});

export default SignUp;
