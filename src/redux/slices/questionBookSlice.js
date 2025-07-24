import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constants/config';
import { updateTopic } from './topicSlice';

export const fetchCurrentQuestionBook = createAsyncThunk(
  'questionBook/fetchCurrentQuestionBook',
  async id => {
    const response = await fetch(`${API_URL}/api/question/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    return data;
  },
);

export const updateCurrentQuestionBook = createAsyncThunk(
  'questionBook/updateCurrentQuestionBook',
  async (questionBook, { dispatch }) => {
    const response = await fetch(`${API_URL}/api/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionBook),
    });

    if (!response.ok) {
      throw new Error('Failed to update question book');
    }
    const data = await response.json();
    dispatch(updateTopic(data));
    return data;
  },
);

const initialState = {
  currentQuestionBook: null,
  fetchCurrentQuestionBookStatus: 'idle',
  updateCurrentQuestionBookStatus: 'idle',
};

const questionBookSlice = createSlice({
  name: 'questionBook',
  initialState,
  reducers: {
    setCurrentQuestionBook: (state, action) => {
      state.currentQuestionBook = action.payload;
      state.fetchCurrentQuestionBookStatus = 'succeeded';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCurrentQuestionBook.fulfilled, (state, action) => {
        state.currentQuestionBook = action.payload;
        state.fetchCurrentQuestionBookStatus = 'succeeded';
      })
      .addCase(fetchCurrentQuestionBook.rejected, (state, action) => {
        state.fetchCurrentQuestionBookStatus = 'failed';
      })
      .addCase(fetchCurrentQuestionBook.pending, (state, action) => {
        state.fetchCurrentQuestionBookStatus = 'loading';
      })
      .addCase(updateCurrentQuestionBook.fulfilled, (state, action) => {
        state.currentQuestionBook = action.payload;
        state.updateCurrentQuestionBookStatus = 'succeeded';
      })
      .addCase(updateCurrentQuestionBook.rejected, (state, action) => {
        state.updateCurrentQuestionBookStatus = 'failed';
      })
      .addCase(updateCurrentQuestionBook.pending, (state, action) => {
        state.updateCurrentQuestionBookStatus = 'loading';
      });
  },
});

export const { setCurrentQuestionBook } = questionBookSlice.actions;

export default questionBookSlice.reducer;
