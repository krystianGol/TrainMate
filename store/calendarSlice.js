import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit';

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        storedEvents: {},
    },
    reducers: {
        addEvent: (state, action) => {
            const {title, date, time} = action.payload;
            const id = nanoid();

            if (!state.storedEvents[date]) {
                state.storedEvents[date] = [];
            }
            state.storedEvents[date].push({id, title, time});
        },
        setEvents: (state, action) => {
            state.storedEvents = action.payload;
          }
    }
})

export const { addEvent, setEvents } = calendarSlice.actions;
export default calendarSlice.reducer;