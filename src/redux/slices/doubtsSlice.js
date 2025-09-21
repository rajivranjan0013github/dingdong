import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constants/config';
import { storage } from '../../utils/MMKVStorage';

const initialState = {
  doubts: [],
  fetchDoubtsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  hasMore: true,
  isFetchingMore: false,
  skip: 0,
  limit: 20,
};

export const fetchDoubts = createAsyncThunk(
  'doubts/fetchDoubts',
  async ({ skip = 0, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const jwt = storage.getString('jwt');
      if (!jwt) {
        return rejectWithValue('Authentication token not found.');
      }
      const response = await fetch(`${API_URL}/api/doubts?skip=${skip}&limit=${limit}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch doubts');
      }

      const data = await response.json();
      return { ...data, skip, limit };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch doubts');
    }
  }
);

const doubtsSlice = createSlice({
  name: 'doubts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoubts.pending, (state) => {
        state.fetchDoubtsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchDoubts.fulfilled, (state, action) => {
        state.fetchDoubtsStatus = 'succeeded';
        state.doubts = action.payload.doubts;
        state.hasMore = action.payload.hasMore;
        state.skip = action.payload.skip + action.payload.limit;
      })
      .addCase(fetchDoubts.rejected, (state, action) => {
        state.fetchDoubtsStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export default doubtsSlice.reducer;
