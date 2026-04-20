import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchWorkspaces,
  createWorkspace,
  inviteMember,
  removeMember,
} from "../api/workspaces";

// GET workspaces
export const loadWorkspaces = createAsyncThunk(
  "workspaces/loadWorkspaces",
  async () => {
    const data = await fetchWorkspaces();
    return data;
  }
);

// CREATE workspace
export const addWorkspace = createAsyncThunk(
  "workspaces/addWorkspace",
  async (name, { rejectWithValue }) => {
    try {
      const data = await createWorkspace(name);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// INVITE member
export const inviteToWorkspace = createAsyncThunk(
  "workspaces/inviteMember",
  async ({ workspaceId, email, role }, { rejectWithValue }) => {
    try {
      const data = await inviteMember(workspaceId, email, role);
      return { workspaceId, workspace: data.workspace };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// REMOVE member
export const removeFromWorkspace = createAsyncThunk(
  "workspaces/removeMember",
  async ({ workspaceId, userId }, { rejectWithValue }) => {
    try {
      await removeMember(workspaceId, userId);
      return { workspaceId, userId };
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState: {
    workspaces: [],
    activeWorkspace: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveWorkspace: (state, action) => {
      state.activeWorkspace = action.payload;
      if (action.payload) {
        localStorage.setItem("activeWorkspaceId", action.payload._id);
      } else {
        localStorage.removeItem("activeWorkspaceId");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;

        const savedId = localStorage.getItem("activeWorkspaceId");
        if (savedId) {
          const found = action.payload.find((w) => w._id === savedId);
          if (found) {
            state.activeWorkspace = found;
          } else if (action.payload.length > 0) {
            state.activeWorkspace = action.payload[0];
          }
        } else if (!state.activeWorkspace && action.payload.length > 0) {
          state.activeWorkspace = action.payload[0];
        } else if (state.activeWorkspace) {
          const updated = action.payload.find(
            (w) => w._id === state.activeWorkspace._id
          );
          if (updated) state.activeWorkspace = updated;
        }
      })
      .addCase(loadWorkspaces.rejected, (state) => {
        state.loading = false;
      });

    builder.addCase(addWorkspace.fulfilled, (state, action) => {
      state.workspaces.unshift(action.payload);
      state.activeWorkspace = action.payload;
      localStorage.setItem("activeWorkspaceId", action.payload._id);
    });

    builder.addCase(inviteToWorkspace.fulfilled, (state, action) => {
      const index = state.workspaces.findIndex(
        (w) => w._id === action.payload.workspaceId
      );
      if (index !== -1) {
        state.workspaces[index] = action.payload.workspace;
        if (state.activeWorkspace?._id === action.payload.workspaceId) {
          state.activeWorkspace = action.payload.workspace;
        }
      }
    });

    builder.addCase(removeFromWorkspace.fulfilled, (state, action) => {
      const index = state.workspaces.findIndex(
        (w) => w._id === action.payload.workspaceId
      );
      if (index !== -1) {
        state.workspaces[index].members = state.workspaces[index].members.filter(
          (m) => m.user._id !== action.payload.userId
        );
      }
    });
  },
});

export const { setActiveWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;