import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import userSlice from './userSlice'
import chatSlice from "./chatSlice"
import messagesSlice from './messagesSlice'
import calendarSlice from './calendarSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    users: userSlice,
    chats: chatSlice,
    messages: messagesSlice,
    calendar: calendarSlice,
  },
})