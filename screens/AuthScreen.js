import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import colors from "../constans/colors";
import PageContainer from "../components/PageContainer";

const AuthScreen = () => {
  const [singUpForm, setSignUpForm] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <PageContainer>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1}}
          >
            {singUpForm ? <SignUp /> : <SignIn />}
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => setSignUpForm((prevValue) => !prevValue)}
            >
              <Text style={styles.link}>{`Zmień na ${
                singUpForm ? "Logowanie" : "Rejestracja"
              }`}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 15,
    marginHorizontal: 30,
    marginTop: 6,
  },
  link: {
    color: "#ffbf00",
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
});

export default AuthScreen;
