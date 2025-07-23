import axios from 'axios';
import { ACCESS_TOKEN } from '@/constants/access';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        const publicEndpoints = [
            '/api/signup/',
            '/api/signin/',
            '/api/token/', 
            '/api/token/refresh/', 
        ];
        
        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.startsWith(endpoint));
        
        if (token && !isPublicEndpoint) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;