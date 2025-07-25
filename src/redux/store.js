import { configureStore } from '@reduxjs/toolkit';
import questionBookReducer from './slices/questionBookSlice';
import topicReducer from './slices/topicSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    questionBook: questionBookReducer,
    topic: topicReducer,
    user: userReducer,
  },
});
