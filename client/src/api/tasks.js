import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchTasks = async (workspaceId) => {
  const url = workspaceId
    ? `${API_URL}/tasks?workspaceId=${workspaceId}`
    : `${API_URL}/tasks`;
  const response = await axios.get(url, authHeader());
  return response.data;
};

export const createTask = async (task) => {
  const response = await axios.post(`${API_URL}/tasks`, task, authHeader());
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, data, authHeader());
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`, authHeader());
  return response.data;
};