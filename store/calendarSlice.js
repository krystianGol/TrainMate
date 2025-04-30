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
          },
        removeEvent: (state, action) => {
            const { date, id } = action.payload;

            if (!state.storedEvents[date]) return;

            state.storedEvents[date] = state.storedEvents[date].filter(
                (event) => event.id !== id
              );

              if (state.storedEvents[date].length === 0) {
                delete state.storedEvents[date];
              }
        }
    }
})

export const { addEvent, setEvents, removeEvent } = calendarSlice.actions;
export default calendarSlice.reducer;