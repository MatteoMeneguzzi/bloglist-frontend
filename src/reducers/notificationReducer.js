import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  content: '',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      state.content = action.payload.content;
    },
    hideNotification(state) {
      state.content = '';
    },
  },
});

export const { setNotification, hideNotification } = notificationSlice.actions;

var timer = null;

export function showNotificationWithTimeout(text) {
  return (dispatch) => {
    dispatch(setNotification(text));

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      dispatch(hideNotification());
    }, text.timer);
  };
}

export default notificationSlice.reducer;
