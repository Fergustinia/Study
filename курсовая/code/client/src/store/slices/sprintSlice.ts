import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SprintFormValues } from '../../components/SprintForm';

interface Sprint {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface SprintState {
  sprints: Sprint[];
  currentSprint: Sprint | null;
  loading: boolean;
  error: string | null;
}

const initialState: SprintState = {
  sprints: [],
  currentSprint: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSprints = createAsyncThunk(
  'sprints/fetchSprints',
  async (projectId: string) => {
    const response = await axios.get(`/api/sprints/${projectId}`);
    return response.data;
  }
);

export const createSprint = createAsyncThunk(
  'sprints/createSprint',
  async (sprintData: SprintFormValues) => {
    const response = await axios.post('/api/sprints', sprintData);
    return response.data;
  }
);

export const updateSprint = createAsyncThunk(
  'sprints/updateSprint',
  async ({ sprintId, sprintData }: { sprintId: string; sprintData: SprintFormValues }) => {
    const response = await axios.put(`/api/sprints/${sprintId}`, sprintData);
    return response.data;
  }
);

export const deleteSprint = createAsyncThunk(
  'sprints/deleteSprint',
  async (sprintId: string) => {
    await axios.delete(`/api/sprints/${sprintId}`);
    return sprintId;
  }
);

const sprintSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    setCurrentSprint: (state, action) => {
      state.currentSprint = action.payload;
    },
    clearCurrentSprint: (state) => {
      state.currentSprint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sprints
      .addCase(fetchSprints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSprints.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = action.payload;
      })
      .addCase(fetchSprints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sprints';
      })
      // Create sprint
      .addCase(createSprint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSprint.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints.push(action.payload);
      })
      .addCase(createSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create sprint';
      })
      // Update sprint
      .addCase(updateSprint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSprint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sprints.findIndex((sprint) => sprint._id === action.payload._id);
        if (index !== -1) {
          state.sprints[index] = action.payload;
        }
      })
      .addCase(updateSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update sprint';
      })
      // Delete sprint
      .addCase(deleteSprint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSprint.fulfilled, (state, action) => {
        state.loading = false;
        state.sprints = state.sprints.filter((sprint) => sprint._id !== action.payload);
      })
      .addCase(deleteSprint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete sprint';
      });
  },
});

export const { setCurrentSprint, clearCurrentSprint } = sprintSlice.actions;
export default sprintSlice.reducer; 