import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const uploadContent = async (formData, token) => {
  const response = await axios.post(`${API_URL}/content/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getContents = async (token) => {
  const res = await axios.get(`${API_URL}/content/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const updateContent = (id, data) => axios.put(`${API_URL}/content/content/${id}`, data);
export const deleteContent = (id) => axios.delete(`${API_URL}/content/content/${id}`);
