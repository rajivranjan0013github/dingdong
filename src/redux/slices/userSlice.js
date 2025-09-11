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
      const preferredLanguage = storage.getString('preferredLanguage')
      const response = await fetch(`${API_URL}/api/login/google/loginSignUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: idToken,
          preferredLanguage: preferredLanguage || "English",
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

// Generic user profile update (partial updates)
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const jwt = storage.getString('jwt');
      const response = await fetch(`${API_URL}/api/user/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      console.log('updateUserProfile.fulfilled', data);

      // Prefer server user object if provided; otherwise return the updates as applied
      return data.user || updates;
    } catch (error) {
      console.error('Update user profile failed:', error);
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
        const responseUser = action.payload.user || {};
        const preferredLanguageFromResponse = responseUser.preferredLanguage;
        const preferredLanguageFromStorage = storage.getString('preferredLanguage');
        const preferredLanguage = preferredLanguageFromResponse || preferredLanguageFromStorage || 'English';

        state.user = { ...responseUser, preferredLanguage };
        state.isLoggedIn = !!action.payload;
        storage.set('user', JSON.stringify(state.user));
        storage.set('preferredLanguage', preferredLanguage);
        storage.set('jwt', action.payload.jwt);
      })
      .addCase(updateUserProfile.pending, state => {
        // no-op
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log('updateUserProfile.fulfilled', action.payload);
        const updates = action.payload || {};
        const mergedUser = { ...(state.user || {}), ...updates };
        state.user = mergedUser;
        storage.set('user', JSON.stringify(mergedUser));
        if (typeof updates.preferredLanguage === 'string' && updates.preferredLanguage.length > 0) {
          storage.set('preferredLanguage', updates.preferredLanguage);
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        // Could handle error UI state here
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
