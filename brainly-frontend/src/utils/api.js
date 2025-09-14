import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://brain-app-qclq.onrender.com'
});

export default api;