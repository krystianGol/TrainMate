import { getFirebaseApp } from "../firebaseHelper";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { child, getDatabase, ref, set, push, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { authenticate, logout } from "../../store/authSlice"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from "./userActions";


let timer;

export const signUp = (firstName, lastName, clubName, city, email, password, experience, fights, weight) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expirationDate = new Date(expirationTime);
      const currentTime = new Date();
      const milisecondsUntilExpiry = expirationDate - currentTime;

      const userData = await createUser(
        uid,
        firstName,
        lastName,
        clubName,
        city,
        email,
        experience,
        fights,
        weight
      );

      dispatch(authenticate({token: accessToken, userData}));
      saveDataToStorage(accessToken, uid, expirationDate);

      timer = setTimeout(() => {
        dispatch(logoutUser());
      }, milisecondsUntilExpiry)
      
    } catch (error) {
      const errorCode = error.code;
      let message = "";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }
      throw new Error(message);
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("result", result)

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expirationDate = new Date(expirationTime);
      const currentTime = new Date();
      const milisecondsUntilExpiry = expirationDate - currentTime;

      const userData = await getUserData(uid);

      dispatch(authenticate({token: accessToken, userData}));
      saveDataToStorage(accessToken, uid, expirationDate);

      timer = setTimeout(() => {
        dispatch(logoutUser());
      }, milisecondsUntilExpiry)

    } catch (error) {
      const errorCode = error.code;
      console.log(errorCode)
      let message = "";
      if (errorCode === "auth/invalid-credential") {
        message = "Email or password is wrong";
      }
      throw new Error(message);
    }
  };
};

const createUser = async (
  userId,
  firstName,
  lastName,
  clubName,
  city,
  email,
  experience,
  fights,
  weight
) => {
  const firstAndLastName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    userId,
    firstName,
    lastName,
    clubName,
    city,
    email,
    experience,
    fights,
    weight,
    firstAndLastName,
    signUpDate: new Date().toISOString(),
  };
  const db = ref(getDatabase());
  const childRef = child(db, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = (token, userId, expiryDate) => {
    const userData = JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    });
    AsyncStorage.setItem('userData', userData);
}

export const logoutUser = () => {
  return async dispatch => {
    AsyncStorage.clear();
    clearTimeout(timer);
    dispatch(logout());
  }
}

export const updateUserData = async (userId, userData) => {
  const app = getFirebaseApp();
  const db = ref(getDatabase(app));
  const userRef = child(db, `users/${userId}`);

  if (userData.firstName && userData.lastName) {
    const firstAndLastName = `${userData.firstName} ${userData.lastName}`.toLowerCase();
    userData.firstAndLastName = firstAndLastName;
  }

  try {
    await update(userRef, userData);
    console.log("User data updated successfully.");
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
}