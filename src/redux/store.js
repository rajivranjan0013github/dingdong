
import { configureStore } from '@reduxjs/toolkit';
import questionBookReducer from './slices/questionBookSlice';

export const store = configureStore({
  reducer: {
    questionBook: questionBookReducer,
  },
});
