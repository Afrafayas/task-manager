import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import authReducer from "./authSlice";
import commentsReducer from "./commentsSlice";
import workspaceReducer from "./workspaceSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    comments: commentsReducer,
    workspaces: workspaceReducer,
  },
});