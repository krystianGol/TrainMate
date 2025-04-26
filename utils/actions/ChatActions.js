import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, ref, push } from "firebase/database";

export const createNewChat = async (loggedInUserId, chatData) => {
    const newChatData = {
        ...chatData,
        createdBy: loggedInUserId,
        updatedBy: loggedInUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const newChat = await push(child(db, "chats"), newChatData);

    const chatUsers = chatData.users;
    for (let i=0; i<chatUsers.length; i++) {
        const userId = chatUsers[i]
        await push(child(db, `userChats/${userId}`), newChat.key);
    }
    return newChat.key;
}