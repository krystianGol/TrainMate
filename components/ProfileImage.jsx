import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { lunchImagePicker } from "../utils/imagePickerHelper";
import userImage from "../constans/images/userImage.jpeg";
import { uploadImageAsync } from "../utils/imagePickerHelper";
import { useSelector, useDispatch } from "react-redux";
import { updateLoggedInUserData } from "../store/authSlice";
import { updateUserData } from "../utils/actions/authActions";

import colors from "../constans/colors";

const ProfileImage = (props) => {
  const source = props.uri ? { uri: props.uri } : userImage;

  const disptach = useDispatch();

  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const userId = props.userId;

  const pickImage = async () => {
    try {
      const result = await lunchImagePicker();
      const tempUri = result.uri;
      console.log(tempUri);
      if (!tempUri) return;

      setIsLoading(true);
      const uploadUri = await uploadImageAsync(tempUri);
      setIsLoading(false);
      if (!uploadUri) {
        throw new Error("Could not upload image");
      }

      const newData = { profilePicture: uploadUri };
      await updateUserData(userId, newData);

      disptach(updateLoggedInUserData({ newData }));

      setImage({ uri: uploadUri });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {isLoading ? (
          <ActivityIndicator 
            size={'small'}
            color={colors.primaryColor}
          />
        ) : (
          <>
            <Image
              source={image}
              style={{
                ...styles.image,
                ...{ height: props.height, width: props.width },
              }}
            />
            <View style={styles.iconContainer}>
              <Feather name="edit-2" size={18} color="black" />
            </View>
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lightGrey,
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});

export default ProfileImage;
