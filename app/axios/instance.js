import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://20.64.237.199:4000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(token);
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
