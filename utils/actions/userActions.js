import { getFirebaseApp } from "../firebaseHelper";
import {
  child,
  get,
  getDatabase,
  ref,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";

export const getUserData = async (userId) => {
  try {
    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const userRef = child(db, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (queryTerm) => {
  const searchTerm = queryTerm.toLowerCase();

  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const snapshot = await get(child(dbRef, "users"));

    if (snapshot.exists()) {
      const users = snapshot.val();

      const filteredUsers = Object.keys(users).reduce((acc, key) => {
        const user = users[key];
        const fullInfo = user.fullUserInfo?.toLowerCase() || "";

        if (fullInfo.includes(searchTerm)) {
          acc[key] = user;
        }
        return acc;
      }, {});

      return filteredUsers;
    }

    return {};
  } catch (error) {
    console.log(error);
    return {};
  }
};
