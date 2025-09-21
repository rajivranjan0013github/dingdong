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
  pdfUploadStatus: 'idle',
  imageUploadStatus: 'idle',
  latestSolve: null,
  error: null,
  generateMoreQuestionsStatus: 'idle',
  getAiExplanationStatus: 'idle',
  aiExplanation: null,
  hasMore: true,
  isFetchingMore: false,
  skip: 0,
  limit: 10,
  total: 0,
  lastFetchTime: null,
};

// Fetch first page of topics
export const fetchTopics = createAsyncThunk(
  'topic/fetchTopics',
  async ({ skip = 0, limit = 10 } = {}, { getState }) => {
    try {
      const state = getState().topic;

      // Prevent duplicate fetches within 2 seconds
      if (state.lastFetchTime && Date.now() - state.lastFetchTime < 2000) {
        return {
          topics: state.topics,
          hasMore: state.hasMore,
          total: state.total,
          skip: state.skip,
          limit: state.limit,
        };
      }

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch topics');
      }
      const data = await response.json();

      // Validate response data
      if (!Array.isArray(data.topics)) {
        throw new Error('Invalid response format: topics array missing');
      }

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
      const state = getState().topic;

      // Prevent duplicate fetches within 2 seconds
      if (state.lastFetchTime && Date.now() - state.lastFetchTime < 2000) {
        return {
          topics: [],
          hasMore: state.hasMore,
          total: state.total,
          skip: state.skip,
          limit: state.limit,
        };
      }

      // Don't fetch if we're already at the end
      if (!state.hasMore) {
        return {
          topics: [],
          hasMore: false,
          total: state.total,
          skip: state.skip,
          limit: state.limit,
        };
      }

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch more topics');
      }
      const data = await response.json();

      // Validate response data
      if (!Array.isArray(data.topics)) {
        throw new Error('Invalid response format: topics array missing');
      }

      return { ...data, skip, limit };
    } catch (error) {
      console.error('Error fetching more topics:', error);
      throw new Error(error.message || 'Failed to fetch more topics');
    }
  },
);

export const generateTopic = createAsyncThunk(
  'topic/generateTopic',
  async (topic, { dispatch, getState }) => {
    try {
      const jwt = storage.getString('jwt');
      const user = getState().user;
      const preferredLanguage = user?.user?.preferredLanguage || storage.getString('preferredLanguage')||'English';
      
      const response = await fetch(`${API_URL}/api/topic/generate-topic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ topic , preferredLanguage: preferredLanguage}),
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

export const getAiExplanation = createAsyncThunk(
  'topic/getAiExplanation',
  async ({
    question,
    options,
    correctAnswer,
    userAnswer,
    originalExplanation,
  }, { getState }) => {
    try {
      const jwt = storage.getString('jwt');
      const user = getState().user;
      const preferredLanguage = user?.user?.preferredLanguage || storage.getString('preferredLanguage')||'English';
      const response = await fetch(`${API_URL}/api/topic/explain-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          userAnswer,
          originalExplanation,
          preferredLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI explanation');
      }

      const data = await response.json();
      return data.explanation;
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      throw new Error(error.message || 'Failed to get AI explanation');
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

export const uploadPdf = createAsyncThunk(
  'topic/uploadPdf',
  async ({ formData }, { dispatch, rejectWithValue }) => {
    try {
      const jwt = storage.getString('jwt');
      const response = await fetch(`${API_URL}/api/topic/upload-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF');
      }

      const data = await response.json();
      dispatch(setCurrentQuestionBook(data?.data));
      return data.data;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      return rejectWithValue(error.message || 'Failed to upload PDF');
    }
  },
);

export const uploadDoubtImage = createAsyncThunk(
  'topic/uploadDoubtImage',
  async ({ formData }, { dispatch, rejectWithValue }) => {
    try {
      const jwt = storage.getString('jwt');
      const response = await fetch(`${API_URL}/api/topic/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      // returns a Solve document: { question, answer, ... }
      return data.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  },
);

// Generate a new question book related to a solved Q&A
export const generateRelatedQuestions = createAsyncThunk(
  'topic/generateRelatedQuestions',
  async ({ solveId, question, answer }, { getState, dispatch }) => {
    try {
      const jwt = storage.getString('jwt');
      const user = getState().user;
      const preferredLanguage = user?.user?.preferredLanguage || storage.getString('preferredLanguage') || 'English';

      const response = await fetch(`${API_URL}/api/topic/generate-from-solve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ solveId, question, answer, preferredLanguage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate related questions');
      }

      const data = await response.json();
      // Also set as current question book for immediate navigation
      dispatch(setCurrentQuestionBook(data?.data));
      return data.data;
    } catch (error) {
      console.error('Error generating related questions:', error);
      throw new Error(error.message || 'Failed to generate related questions');
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
        // Don't clear topics immediately to prevent UI flicker
        if (!state.topics.length) {
          state.topics = [];
        }
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.fetchTopicStatus = 'succeeded';
        state.topics = action.payload.topics;
        state.hasMore = action.payload.hasMore;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.limit = action.payload.limit;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.fetchTopicStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchMoreTopics.pending, (state, action) => {
        // Prevent duplicate fetches
        if (state.isFetchingMore) return;
        state.isFetchingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreTopics.fulfilled, (state, action) => {
        state.isFetchingMore = false;
        // Filter out any duplicates by _id
        const newTopics = action.payload.topics.filter(
          newTopic =>
            !state.topics.some(
              existingTopic => existingTopic._id === newTopic._id,
            ),
        );
        state.topics = [...state.topics, ...newTopics];
        state.hasMore = action.payload.hasMore;
        state.total = action.payload.total;
        state.skip = action.payload.skip;
        state.lastFetchTime = Date.now();
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
      })
      .addCase(getAiExplanation.pending, state => {
        state.getAiExplanationStatus = 'loading';
        state.aiExplanation = null;
        state.error = null;
      })
      .addCase(getAiExplanation.fulfilled, (state, action) => {
        state.getAiExplanationStatus = 'succeeded';
        state.aiExplanation = action.payload;
      })
      .addCase(getAiExplanation.rejected, (state, action) => {
        state.getAiExplanationStatus = 'failed';
        state.error = action.error.message;
      })
      .addCase(uploadPdf.pending, state => {
        state.pdfUploadStatus = 'loading';
        state.error = null;
      })
      .addCase(uploadPdf.fulfilled, (state, action) => {
        state.pdfUploadStatus = 'succeeded';
        state.generateTopicStatus = 'succeeded';
        state.topics.unshift(action.payload);
      })
      .addCase(uploadPdf.rejected, (state, action) => {
        state.pdfUploadStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadDoubtImage.pending, state => {
        state.imageUploadStatus = 'loading';
        state.latestSolve = null;
        state.error = null;
      })
      .addCase(uploadDoubtImage.fulfilled, (state, action) => {
        state.imageUploadStatus = 'succeeded';
        // store the latest solution payload (Solve document)
        state.latestSolve = action.payload;
      })
      .addCase(uploadDoubtImage.rejected, (state, action) => {
        state.imageUploadStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(generateRelatedQuestions.pending, state => {
        state.generateMoreQuestionsStatus = 'loading';
      })
      .addCase(generateRelatedQuestions.fulfilled, (state, action) => {
        state.generateMoreQuestionsStatus = 'succeeded';
        if (action.payload) {
          state.topics.unshift(action.payload);
        }
      })
      .addCase(generateRelatedQuestions.rejected, (state, action) => {
        state.generateMoreQuestionsStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updateTopic, resetTopics } = topicSlice.actions;

export default topicSlice.reducer;
