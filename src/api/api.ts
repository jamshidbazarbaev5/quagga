import axios from "axios";

export const api = axios.create({
    baseURL: 'https://easybonus.uz/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear all auth related data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            
            // Use replace state to avoid navigation history issues
            window.location.replace('/login');
        }
        return Promise.reject(error);
    }
);



