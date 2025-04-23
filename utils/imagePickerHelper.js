import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import uuid from 'react-native-uuid';
import { getFirebaseApp } from "./firebaseHelper";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const lunchImagePicker = async () => {
  await checkMediaPermissions();

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  console.log(result);

  if (!result.canceled) {
    return result.assets[0];
  }
};

const checkMediaPermissions = async () => {
  if (Platform !== "web") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) {
      return Promise.reject("We need permission to access your photos");
    }
  }
  return Promise.resolve();
};

export async function uploadImageAsync(uri) {
    const app = getFirebaseApp();
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    
    const pathFolder = "profilePics";
    const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);
    await uploadBytes(storageRef, blob);
    blob.close();
  
    return await getDownloadURL(storageRef);
  }