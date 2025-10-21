import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend URL
});

// Interceptor to attach token to requests
API.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).token}`;
  }
  return req;
});

export default API;