import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  user: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
      if (action.payload) {
        AsyncStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        AsyncStorage.removeItem('user');
      }
    },
    logout: state => {
      state.user = null;
      state.isLoggedIn = false;
      AsyncStorage.removeItem('user');
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
