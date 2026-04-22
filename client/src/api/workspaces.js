import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchWorkspaces = async () => {
  const response = await axios.get(`${API_URL}/workspace`, authHeader());
  return response.data;
};

export const createWorkspace = async (name) => {
  const response = await axios.post(
    `${API_URL}/workspace`,
    { name },
    authHeader()
  );
  return response.data;
};

export const inviteMember = async (workspaceId, email, role = "member") => {
  const response = await axios.post(
    `${API_URL}/workspace/${workspaceId}/invite`,
    { email, role },
    authHeader()
  );
  return response.data;
};

export const removeMember = async (workspaceId, userId) => {
  const response = await axios.delete(
    `${API_URL}/workspace/${workspaceId}/members/${userId}`,
    authHeader()
  );
  return response.data;
};