import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (taskId: string) => {
    const response = await axios.get(`/api/tasks/${taskId}/comments`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ taskId, content }: { taskId: string; content: string }) => {
    const response = await axios.post(`/api/tasks/${taskId}/comments`, { content });
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ taskId, commentId }: { taskId: string; commentId: string }) => {
    await axios.delete(`/api/tasks/${taskId}/comments/${commentId}`);
    return commentId;
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add comment';
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter((comment) => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete comment';
      });
  },
});

export default commentSlice.reducer; 