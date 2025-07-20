import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constrant/config';

export const fetchCurrentQuestionBook = createAsyncThunk(
    'questionBook/fetchCurrentQuestionBook',
    async (id) => {
        const response = await fetch(`${API_URL}/api/question/${id}`);
        
        if(!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        return data;
    }
);

export const updateCurrentQuestionBook = createAsyncThunk(
    'questionBook/updateCurrentQuestionBook',
    async (questionBook) => {
        const response = await fetch(`${API_URL}/api/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionBook),
        });

        if(!response.ok) {
            throw new Error('Failed to update question book');
        }
        const data = await response.json();
        return data;
    }
);

const initialState = {
    currentQuestionBook: null,
    questions: [],
    fetchQuestionsStatus: 'idle',
};

const questionBookSlice = createSlice({ 
    name: 'questionBook',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentQuestionBook.fulfilled, (state, action) => {
            state.currentQuestionBook = action.payload;
            state.fetchQuestionsStatus = 'succeeded';
        })
        .addCase(fetchCurrentQuestionBook.rejected, (state, action) => {
            state.fetchQuestionsStatus = 'failed';
        }).addCase(fetchCurrentQuestionBook.pending, (state, action) => {
            state.fetchQuestionsStatus = 'loading';
        }).addCase(updateCurrentQuestionBook.fulfilled, (state, action) => {
            state.currentQuestionBook = action.payload;
            state.fetchQuestionsStatus = 'succeeded';
        }).addCase(updateCurrentQuestionBook.rejected, (state, action) => {
            state.fetchQuestionsStatus = 'failed';
        }).addCase(updateCurrentQuestionBook.pending, (state, action) => {
            state.fetchQuestionsStatus = 'loading';
        });
    },
});

export default questionBookSlice.reducer;