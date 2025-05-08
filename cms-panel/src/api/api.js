import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const uploadContent = async (formData, token) => {
  const response = await axios.post(`${API_URL}/contents/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getContents = async () => {
  const response = await axios.get(`${API_URL}/contents/`);
  return response.data;
};
