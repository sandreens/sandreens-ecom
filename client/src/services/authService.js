import api from './api';

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const logoutUser = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const forgotPasswordRequest = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPasswordRequest = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/update-profile', payload);
  return data;
};

export const changePasswordRequest = async (payload) => {
  const { data } = await api.put('/auth/change-password', payload);
  return data;
};