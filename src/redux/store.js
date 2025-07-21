
import { configureStore } from '@reduxjs/toolkit';
import questionBookReducer from './slices/questionBookSlice';
import topicReducer from './slices/topicSlice';

export const store = configureStore({
  reducer: {
    questionBook: questionBookReducer,
    topic: topicReducer,
  },
});
