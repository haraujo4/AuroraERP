import api from './api';

export interface SystemInfo {
    serverName: string;
    databaseName: string;
    version: string;
    environment: string;
}

export const systemService = {
    getSystemInfo: async (): Promise<SystemInfo> => {
        const response = await api.get<SystemInfo>('/system/info');
        return response.data;
    }
};
