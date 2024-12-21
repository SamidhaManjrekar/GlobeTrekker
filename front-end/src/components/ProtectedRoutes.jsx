import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/interceptor';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '@/constants/access';

function ProtectedRoutes({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh,
            });
            
            const newAccessToken = res.data.access;
            localStorage.setItem(ACCESS_TOKEN, newAccessToken);
            setIsAuthorized(true);
        } catch (error) {
            console.error("Token refresh failed:", error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    useEffect(() => {
        (async () => {
            await auth();
        })();
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/signin" />;
}

export default ProtectedRoutes;