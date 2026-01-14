import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5283/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token header to every request
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.token) {
                    config.headers['Authorization'] = `Bearer ${user.token}`;
                }
            } catch (e) {
                // Ignore parse error
            }
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export { api }; // Named export instead of default to match typical usage pattern if needed, but keeping default for now.
export default api;
