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
    const db = ref(getDatabase(app));
    const userRef = child(db, "users");
    const queryRef = query(
      userRef,
      orderByChild("firstAndLastName"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.log(error);
  }
};
