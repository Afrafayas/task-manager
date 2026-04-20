import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchComments = async (taskId) => {
  const response = await axios.get(
    `${API_URL}/tasks/${taskId}/comments`,
    authHeader()
  );
  return response.data;
};

export const createComment = async (taskId, text) => {
  const response = await axios.post(
    `${API_URL}/tasks/${taskId}/comments`,
    { text },
    authHeader()
  );
  return response.data;
};

export const deleteComment = async (taskId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/tasks/${taskId}/comments/${commentId}`,
    authHeader()
  );
  return response.data;
};

export const addReply = async (taskId, commentId, text) => {
  const response = await axios.post(
    `${API_URL}/tasks/${taskId}/comments/${commentId}/replies`,
    { text },
    authHeader()
  );
  return response.data;
};

export const deleteReply = async (taskId, commentId, replyId) => {
  const response = await axios.delete(
    `${API_URL}/tasks/${taskId}/comments/${commentId}/replies/${replyId}`,
    authHeader()
  );
  return response.data;
};