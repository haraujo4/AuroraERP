import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export interface User {
    username: string;
    roles: string[];
    token: string;
}

export const authService = {
    async login(username: string, password: string): Promise<User> {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        const user = response.data;
        if (user.token) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    },

    getToken(): string | null {
        const user = this.getCurrentUser();
        return user ? user.token : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};

// Axios Interceptor for JWT
axios.interceptors.request.use(
    (config) => {
        const token = authService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
