import { ScrollView, ActivityIndicator, Alert, View, TouchableWithoutFeedback } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useReducer, useCallback, useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';

import PageContainer from "../components/PageContainer";
import Input from "../components/Input";
import LabeledSlider from "../components/LabeledSlider";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authActions";
import { updateUserData } from "../utils/actions/authActions";
import colors from "../constans/colors";
import { updateLoggedInUserData } from "../store/authSlice";
import { logoutUser } from "../utils/actions/authActions";
import ProfileImage from "../components/ProfileImage";
import { HeaderTitle } from "@react-navigation/elements";

const ProfileScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const initialState = {
    inputValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      clubName: userData.clubName || "",
      city: userData.city || "",
      email: userData.email || "",
      experience: userData.experience || 0,
      fights: userData.fights || 0,
      weight: userData.weight || 0,
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      clubName: undefined,
      city: undefined,
      email: undefined,
    },
    formIsValid: false,
  };

  const [state, dispatchForm] = useReducer(reducer, initialState);
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchForm({ inputValue, inputId, validationResult: result });
    },
    [dispatchForm]
  );

  const filterUserData = (data) => {
    const {
      firstName,
      lastName,
      clubName,
      city,
      email,
      experience,
      fights,
      weight,
    } = data;
    return {
      firstName,
      lastName,
      clubName,
      city,
      email,
      experience,
      fights,
      weight,
    };
  };

  const dataChanged =
    JSON.stringify(filterUserData(userData)) !==
    JSON.stringify(state.inputValues);

  const onSliderChange = (id, value) => {
    dispatchForm({
      inputId: id,
      inputValue: value,
      validationResult: undefined,
    });
  };

  const saveHandler = useCallback(async () => {
    const updatedValues = state.inputValues;
    try {
      setIsLoading(true);
      await updateUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, state]);

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("An error occured", errorMessage);
    }
  }, [errorMessage]);


  return (
    <PageContainer>
      <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="light" />
        <TouchableWithoutFeedback onPress={() => dispatch(logoutUser())}>
        <View style={{ width: '100%', flex: 1, justifyContent: 'start', alignItems: 'flex-end'}}>
        <MaterialIcons style={{ color: colors.red, marginRight: 4 }} name="logout" size={24} color="black" />
        </View>
        </TouchableWithoutFeedback>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ProfileImage 
          userId={userData.userId}
          uri={userData.profilePicture}
          height={90}
          width={90}
          newChat={false}
        />
      </View>
      <Input
        id="firstName"
        iconPack={FontAwesome}
        iconName="user-o"
        size={24}
        color="black"
        placeholder="Wpisz swoje imie"
        label="Imie"
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
        placeholder="Wpisz swoje nazwisko"
        label="Nazwisko"
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
        placeholder="Wpisz swók klub bokserski"
        label="Klub Bokserski"
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
        placeholder="Wpisz swoje miasto"
        label="Miasto"
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
        placeholder="Wpisz swój email"
        label="Email"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
        errorText={state.inputValidities["email"]}
        value={state.inputValues["email"]}
      />

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
        dataChanged && (
          <SubmitButton
            title="Aktualizuj"
            onPress={saveHandler}
            disabled={!state.formIsValid}
          />
        )
      )}
      </ScrollView>
      </SafeAreaView>
    </PageContainer>
  );
};

export default ProfileScreen;
