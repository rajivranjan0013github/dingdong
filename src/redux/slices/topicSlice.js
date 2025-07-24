import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constrant/config';
import {
  setCurrentQuestionBook,
  updateCurrentQuestionBook,
} from './questionBookSlice';

const initialState = {
  topics: [],
  fetchTopicStatus: 'idle',
  generateTopicStatus: 'idle',
  error: null,
  generateMoreQuestionsStatus: 'idle',
};

export const fetchTopics = createAsyncThunk('topic/fetchTopics', async () => {
  const response = await fetch(`${API_URL}/api/topic`);
  if (!response.ok) {
    throw new Error('Failed to fetch topics');
  }
  const data = await response.json();
  return data;
});

export const generateTopic = createAsyncThunk(
  'topic/generateTopic',
  async (topic, { dispatch }) => {
    const response = await fetch(`${API_URL}/api/topic/generate-topic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate topic');
    }
    const data = await response.json();
    dispatch(setCurrentQuestionBook(data?.data));
    return data.data;
  },
);

export const generateMoreQuestions = createAsyncThunk(
  'topic/generateMoreQuestions',
  async (questionBookId, { dispatch, getState }) => {
    const response = await fetch(`${API_URL}/api/topic/more-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionBookId,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate more questions');
    }
    const data = await response.json();
    dispatch(setCurrentQuestionBook(data?.data));

    return data.data;
  },
);

const topicSlice = createSlice({
  name: 'topic',
  initialState,
  reducers: {
    updateTopic: (state, action) => {
      const newTopic = action.payload;
      const topicIndex = state.topics.findIndex(
        topic => topic._id === newTopic._id,
      );

      if (topicIndex !== -1) {
        // Update the topic at the found index
        state.topics[topicIndex] = {
          ...state.topics[topicIndex],
          ...newTopic,
        };
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTopics.pending, state => {
        state.fetchTopicStatus = 'loading';
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.fetchTopicStatus = 'succeeded';
        console.log('action.payload fetch', action.payload);
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.fetchTopicStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(generateTopic.pending, state => {
        state.generateTopicStatus = 'loading';
      })
      .addCase(generateTopic.fulfilled, (state, action) => {
        state.generateTopicStatus = 'succeeded';
        console.log('action.payload', action.payload);
        state.topics.unshift(action.payload);
      })
      .addCase(generateTopic.rejected, (state, action) => {
        state.generateTopicStatus = 'failed';
        state.error = action.error.message;
        console.log(action.error);
      })
      .addCase(generateMoreQuestions.pending, state => {
        state.generateMoreQuestionsStatus = 'loading';
      })
      .addCase(generateMoreQuestions.fulfilled, (state, action) => {
        state.generateMoreQuestionsStatus = 'succeeded';
        const updatedQuestionBook = action.payload;
        console.log('updatedQuestionBook', updatedQuestionBook);

        // Find the topic that contains this question book
        const topicIndex = state.topics.findIndex(
          topic => topic._id === updatedQuestionBook._id,
        );

        if (topicIndex !== -1) {
          state.topics[topicIndex].questions = updatedQuestionBook.questions;
        }
      })
      .addCase(generateMoreQuestions.rejected, (state, action) => {
        state.generateMoreQuestionsStatus = 'failed';
        state.error = action.error.message;
        console.log(action.error);
      });
  },
});

export const { updateTopic } = topicSlice.actions;

export default topicSlice.reducer;
