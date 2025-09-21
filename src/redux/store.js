import { configureStore } from '@reduxjs/toolkit';
import questionBookReducer from './slices/questionBookSlice';
import topicReducer from './slices/topicSlice';
import userReducer from './slices/userSlice';
import doubtsReducer from './slices/doubtsSlice';

export const store = configureStore({
  reducer: {
    questionBook: questionBookReducer,
    topic: topicReducer,
    user: userReducer,
    doubts: doubtsReducer,
  },
});
