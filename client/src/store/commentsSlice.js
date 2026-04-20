import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchComments, createComment, deleteComment, addReply, deleteReply } from "../api/comments";

// GET comments
export const loadComments = createAsyncThunk(
  "comments/loadComments",
  async (taskId) => {
    const data = await fetchComments(taskId);
    return data;
  }
);

// CREATE comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ taskId, text }) => {
    const data = await createComment(taskId, text);
    return data;
  }
);

// DELETE comment
export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async ({ taskId, commentId }) => {
    await deleteComment(taskId, commentId);
    return commentId;
  }
);

// ADD reply
export const addReplyToComment = createAsyncThunk(
  "comments/addReply",
  async ({ taskId, commentId, text }) => {
    const data = await addReply(taskId, commentId, text);
    return data;
  }
);

// DELETE reply
export const removeReply = createAsyncThunk(
  "comments/removeReply",
  async ({ taskId, commentId, replyId }) => {
    await deleteReply(taskId, commentId, replyId);
    return { commentId, replyId };
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(loadComments.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load comments";
      });

    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      });

    builder
      .addCase(removeComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c._id !== action.payload
        );
      });

    // addReply
    builder
      .addCase(addReplyToComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.comments[index] = action.payload;
      });

    // removeReply
    builder
      .addCase(removeReply.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload.commentId
        );
        if (index !== -1) {
          state.comments[index].replies = state.comments[index].replies.filter(
            (r) => r._id !== action.payload.replyId
          );
        }
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;