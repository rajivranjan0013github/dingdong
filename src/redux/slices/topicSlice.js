import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constants/config';
import { storage } from '../../utils/MMKVStorage';
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
  hasMore: true,
  isFetchingMore: false,
  skip: 0,
  limit: 10,
};

// Fetch first page of topics
export const fetchTopics = createAsyncThunk(
  'topic/fetchTopics',
  async ({ skip = 0, limit = 10 } = {}) => {
    try {
      const jwt = storage.getString('jwt');

      const response = await fetch(
        `${API_URL}/api/topic?skip=${skip}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      return { ...data, skip, limit };
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw new Error(error.message || 'Failed to fetch topics');
    }
  },
);

// Fetch more topics for pagination
export const fetchMoreTopics = createAsyncThunk(
  'topic/fetchMoreTopics',
  async ({ skip, limit }, { getState }) => {
    try {
      const jwt = storage.getString('jwt');
      const response = await fetch(
        `${API_URL}/api/topic?skip=${skip}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch more topics');
      }
      const data = await response.json();
      return { ...data, skip, limit };
    } catch (error) {
      console.error('Error fetching more topics:', error);
      throw new Error(error.message || 'Failed to fetch more topics');
    }
  },
);

export const generateTopic = createAsyncThunk(
  'topic/generateTopic',
  async (topic, { dispatch }) => {
    try {
      const jwt = storage.getString('jwt');
      const response = await fetch(`${API_URL}/api/topic/generate-topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate topic');
      }
      const data = await response.json();
      dispatch(setCurrentQuestionBook(data?.data));
      return data.data;
    } catch (error) {
      console.error('Error generating topic:', error);
      throw new Error(error.message || 'Failed to generate topic');
    }
  },
);

export const generateMoreQuestions = createAsyncThunk(
  'topic/generateMoreQuestions',
  async (questionBookId, { dispatch, getState }) => {
    try {
      const jwt = storage.getString('jwt');
      const response = await fetch(`${API_URL}/api/topic/more-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
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
    } catch (error) {
      console.error('Error generating more questions:', error);
      throw new Error(error.message || 'Failed to generate more questions');
    }
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
      } else {
        state.topics.unshift(newTopic);
      }
    },
    resetTopics: state => {
      state.topics = [];
      state.hasMore = true;
      state.skip = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTopics.pending, state => {
        state.fetchTopicStatus = 'loading';
        state.error = null;
        state.topics = [];
        state.skip = 0;
        state.hasMore = true;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.fetchTopicStatus = 'succeeded';
        state.topics = action.payload.topics;
        state.hasMore = action.payload.hasMore;
        state.skip = action.payload.topics.length;
        state.limit = action.payload.limit;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.fetchTopicStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMoreTopics.pending, state => {
        state.isFetchingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreTopics.fulfilled, (state, action) => {
        state.isFetchingMore = false;
        state.topics = [...state.topics, ...action.payload.topics];
        state.hasMore = action.payload.hasMore;
        state.skip += action.payload.topics.length;
      })
      .addCase(fetchMoreTopics.rejected, (state, action) => {
        state.isFetchingMore = false;
        state.error = action.error.message;
      })
      .addCase(generateTopic.pending, state => {
        state.generateTopicStatus = 'loading';
      })
      .addCase(generateTopic.fulfilled, (state, action) => {
        state.generateTopicStatus = 'succeeded';
        state.topics.unshift(action.payload);
      })
      .addCase(generateTopic.rejected, (state, action) => {
        state.generateTopicStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(generateMoreQuestions.pending, state => {
        state.generateMoreQuestionsStatus = 'loading';
      })
      .addCase(generateMoreQuestions.fulfilled, (state, action) => {
        state.generateMoreQuestionsStatus = 'succeeded';
        const updatedQuestionBook = action.payload;

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
      });
  },
});

export const { updateTopic, resetTopics } = topicSlice.actions;

export default topicSlice.reducer;
