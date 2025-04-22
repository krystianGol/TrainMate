import { getFirebaseApp } from "../firebaseHelper"
import { child, get, getDatabase, ref, set } from "firebase/database";

export const getUserData = async (userId) => {
    try {
        const app = getFirebaseApp();
        const db = ref(getDatabase(app))
        const userRef = child(db, `users/${userId}`);
        const snapshot = await get(userRef);
        return snapshot.val();
    } catch (error) {
        console.log(error);
    }
}