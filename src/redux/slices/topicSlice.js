import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../constrant/config';

const initialState = {
    topics: [],
    fetchTopicStatus: 'idle',
    error: null,
}

export const fetchTopics = createAsyncThunk('topic/fetchTopics', async () => {
    const response = await fetch(`${API_URL}/api/topic`);
    if (!response.ok) {
        throw new Error('Failed to fetch topics');
    }
    const data = await response.json();
    return data;
});

const topicSlice = createSlice({
    name: 'topic',
    initialState,
    reducers: {
        updateTopic: (state, action) => {
            const newTopic = action.payload;
            const topicIndex = state.topics.findIndex(topic => topic._id === newTopic._id);
            
            if (topicIndex !== -1) {
                // Update the topic at the found index
                state.topics[topicIndex] = {
                    ...state.topics[topicIndex],
                    ...newTopic
                };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopics.pending, (state) => {
                state.fetchTopicStatus = 'loading';
            })
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.fetchTopicStatus = 'succeeded';
                state.topics = action.payload;
            })
            .addCase(fetchTopics.rejected, (state, action) => {
                state.fetchTopicStatus = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { updateTopic } = topicSlice.actions;

export default topicSlice.reducer;