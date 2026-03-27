import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";

// ── Async Actions (talk to backend) ──

export const loadTasks = createAsyncThunk(
  "tasks/loadTasks",
  async () => {
    const data = await fetchTasks();
    return data;
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData) => {
    const data = await createTask(taskData);
    return data;
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, taskData }) => {
    const data = await updateTask(id, taskData);
    return data;
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id) => {
    await deleteTask(id);
    return id;
  }
);

// ── Slice ──
const tasksSlice = createSlice({
  name: "tasks",

  initialState: {
    tasks:       [],
    loading:     false,
    error:       null,
    showForm:    false,
    editingTask: null,
    deleteId:    null,
  },

  // Sync actions (no API)
  reducers: {
    openForm:    (state) => { state.showForm = true; },
    closeForm:   (state) => { state.showForm = false; state.editingTask = null; },
    setEditing:  (state, action) => { state.editingTask = action.payload; state.showForm = true; },
    setDeleteId: (state, action) => { state.deleteId = action.payload; },
    clearDelete: (state) => { state.deleteId = null; },
  },

  // Async actions (API calls)
  extraReducers: (builder) => {

    // loadTasks
    builder
      .addCase(loadTasks.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks   = action.payload;
      })
      .addCase(loadTasks.rejected, (state) => {
        state.loading = false;
        state.error   = "Failed to load tasks";
      });

    // addTask
    builder
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
        state.showForm = false;
      });

    // editTask
    builder
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
        state.showForm    = false;
        state.editingTask = null;
      });

    // removeTask
    builder
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks    = state.tasks.filter(t => t._id !== action.payload);
        state.deleteId = null;
      });
  }
});

export const {
  openForm,
  closeForm,
  setEditing,
  setDeleteId,
  clearDelete
} = tasksSlice.actions;

export default tasksSlice.reducer;