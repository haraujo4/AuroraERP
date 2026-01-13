import api from './api';

export interface User {
    username: string;
    roles: string[];
    token: string;
    companyName?: string;
    branchName?: string;
    empresaId?: string;
    filialId?: string;
}

export const authService = {
    async login(username: string, password: string): Promise<User> {
        const response = await api.post('/auth/login', { username, password });
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
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    getToken(): string | null {
        const user = this.getCurrentUser();
        return user ? user.token : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};
