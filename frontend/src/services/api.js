import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBoard = async (boardId = 1) => {
  const response = await api.get(`/boards/${boardId}`);
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

export const updateTask = async (taskId, task) => {
  const response = await api.put(`/tasks/${taskId}`, task);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export const moveTask = async (taskId, columnId) => {
  const response = await api.patch(`/tasks/${taskId}/move`, {
    columnId,
  });

  return response.data;
};

export const getTasksByPriority = async (priority) => {
  const response = await api.get(
    `/tasks/priority?priority=${priority}`
  );

  return response.data;
};

export default api;