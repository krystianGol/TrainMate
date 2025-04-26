import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, ref, push, update } from "firebase/database";

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

export const sendTextMessage = async (chatId, senderId, messageText) => {
    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const messsageRef = child(db, `messages/${chatId}`);
    const messageData = {
        sentBy: senderId,
        sentAt: new Date().toISOString(),
        text: messageText,
    }
    await push(messsageRef, messageData);

    const chatRef = child(db, `chats/${chatId}`);
    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestMessageText: messageText,
    });
}
