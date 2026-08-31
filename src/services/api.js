import axios from 'axios';

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    headers:{
        'Content-Type':'application/json'
    },
    validateStatus: function (status) {
        return status < 500;
    }
});

axiosInstance.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosInstance;