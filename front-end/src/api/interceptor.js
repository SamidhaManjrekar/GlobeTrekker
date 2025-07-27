import axios from 'axios';
import { ACCESS_TOKEN } from '@/constants/access';
import { jwtDecode } from 'jwt-decode'; 
import { REFRESH_TOKEN } from '@/constants/access'; 
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://globetrekker-backend-api.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        const publicEndpoints = [
            '/api/signup/',
            '/api/signin/',
            '/api/token/', 
            '/api/token/refresh/', 
        ];

        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url.startsWith(endpoint));

        if (isPublicEndpoint || !accessToken) {
            return config;
        }

        try {
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000; 
            if (decodedToken.exp < currentTime) {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (refreshToken) {
                    try {
                        const refreshRes = await axios.post(
                            `${api.defaults.baseURL}/api/token/refresh/`,
                            { refresh: refreshToken }
                        );
                        const newAccessToken = refreshRes.data.access;
                        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                        config.headers.Authorization = `Bearer ${newAccessToken}`;
                    } catch (refreshError) {
                        console.error("Token refresh failed in request interceptor:", refreshError);
                        localStorage.removeItem(ACCESS_TOKEN);
                        localStorage.removeItem(REFRESH_TOKEN);
                        return Promise.reject(refreshError); 
                    }
                } else {
                    localStorage.removeItem(ACCESS_TOKEN);
                    return Promise.reject(new Error("No refresh token available."));
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error("Error decoding or validating token in request interceptor:", error);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            return Promise.reject(error); 
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 

            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    const refreshRes = await axios.post(
                        `${api.defaults.baseURL}/api/token/refresh/`, 
                        { refresh: refreshToken }
                    );
                    const newAccessToken = refreshRes.data.access;
                    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Failed to refresh token on 401 response:", refreshError);
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                    return Promise.reject(refreshError);
                }
            } else {
                localStorage.removeItem(ACCESS_TOKEN);
            }
        }
        return Promise.reject(error);
    }
);

export default api;