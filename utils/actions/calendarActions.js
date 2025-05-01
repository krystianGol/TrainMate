import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, ref, set, push, get, remove } from "firebase/database";

export const saveEvent = async (loggedInUserId, eventData) => {
  try {
    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    
    const eventId = eventData.id || push(child(db, `events/${loggedInUserId}`)).key;
    const eventRef = child(db, `events/${loggedInUserId}/${eventId}`);

    await set(eventRef, { ...eventData, id: eventId });

  } catch (error) {
    console.log(error);
  }
};

export const loadEvents = async (userId) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  try {
    const snapshot = await get(child(dbRef, `events/${userId}`));
    if (!snapshot.exists()) return {};

    const rawData = snapshot.val();
    const formattedEvents = {};

    Object.values(rawData).forEach(event => {
      const { date, ...eventData } = event;
      if (!formattedEvents[date]) {
        formattedEvents[date] = [];
      }
      formattedEvents[date].push(eventData);
    });

    return formattedEvents;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const removeEventFromDatabase = async (loggedInUserId, eventId) => {
  try {
    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const eventRef = child(db, `events/${loggedInUserId}/${eventId}`);

    await remove(eventRef); 

  } catch (error) { 
      console.log(error);
  }
}