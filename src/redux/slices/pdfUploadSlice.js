import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constants/config';
import { storage } from '../../utils/MMKVStorage';
import { setCurrentQuestionBook } from './questionBookSlice';

const initialState = {
  pdfUploadStatus: 'idle',
  error: null,
};

export const uploadPdf = createAsyncThunk(
  'pdf/uploadPdf',
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

const pdfUploadSlice = createSlice({
  name: 'pdfUpload',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(uploadPdf.pending, state => {
        state.pdfUploadStatus = 'loading';
        state.error = null;
      })
      .addCase(uploadPdf.fulfilled, state => {
        state.pdfUploadStatus = 'succeeded';
        
      })
      .addCase(uploadPdf.rejected, (state, action) => {
        state.pdfUploadStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export default pdfUploadSlice.reducer;
