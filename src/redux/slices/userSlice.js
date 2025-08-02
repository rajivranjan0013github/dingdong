import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storage } from '../../utils/MMKVStorage';
import { API_URL } from '../../constants/config';

const initialState = {
  user: null,
  isLoggedIn: false,
};

export const googleLoginSignUp = createAsyncThunk(
  'user/googleLoginSignUp',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/login/google/loginSignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: idToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      return data;
    } catch (error) {
      console.error('Google sign-up failed:', error);
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
      if (action.payload) {
        storage.set('user', JSON.stringify(action.payload));
      } else {
        storage.delete('user');
      }
    },
    logout: state => {
      state.user = null;
      state.isLoggedIn = false;
      storage.delete('user');
      storage.delete('jwt');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(googleLoginSignUp.pending, state => {
        // Handle pending state if needed
      })
      .addCase(googleLoginSignUp.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = !!action.payload;
        storage.set('user', JSON.stringify(action.payload.user));
        storage.set('jwt', action.payload.jwt);
      })
      .addCase(googleLoginSignUp.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        storage.delete('user');
        storage.delete('jwt');
        // Handle error state if needed
      });
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
