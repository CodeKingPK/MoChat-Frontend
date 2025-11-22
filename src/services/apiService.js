import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout user
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  refreshToken: () =>
    api.post('/auth/refresh'),
};

// User APIs
export const userAPI = {
  searchUsers: (query) => 
    api.get('/users/search', { params: { q: query } }),
  
  getUser: (userId) => 
    api.get(`/users/${userId}`),
  
  updateProfile: (data) => 
    api.put('/users/profile', data),
  
  uploadAvatar: (formData) => 
    api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  checkUsername: (username) =>
    api.get(`/users/check-username/${username}`),
};

// Chat APIs
export const chatAPI = {
  getChats: () => 
    api.get('/chats'),
  
  getChat: (chatId) => 
    api.get(`/chats/${chatId}`),
  
  createChat: (userId) => 
    api.post('/chats', { userId }),
  
  getMessages: (chatId, page = 1, limit = 50) => 
    api.get(`/chats/${chatId}/messages`, { params: { page, limit } }),
  
  sendMessage: (chatId, message) => 
    api.post(`/chats/${chatId}/messages`, message),
  
  deleteMessage: (chatId, messageId) => 
    api.delete(`/chats/${chatId}/messages/${messageId}`),
};

// Media APIs
export const mediaAPI = {
  uploadImage: (formData) => 
    api.post('/media/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  uploadVideo: (formData) => 
    api.post('/media/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  uploadAudio: (formData) => 
    api.post('/media/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Call APIs
export const callAPI = {
  getCallHistory: (limit = 50, offset = 0) =>
    api.get('/calls/history', { params: { limit, offset } }),
  
  createCallRecord: (receiverId, callType) =>
    api.post('/calls/create', { receiverId, type: callType }),
  
  updateCallRecord: (callId, status, duration) =>
    api.patch(`/calls/${callId}`, { status, duration }),
  
  deleteCallRecord: (callId) =>
    api.delete(`/calls/${callId}`),
};

export default api;
