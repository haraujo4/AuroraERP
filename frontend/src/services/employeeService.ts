import api from './api';

export interface Employee {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    birthDate: string;
    hireDate: string;
    salary: number;
    isActive: boolean;
    jobTitleId: string;
    jobTitleName?: string;
    departmentId: string;
    departmentName?: string;
    address: {
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
}

export interface Department {
    id: string;
    name: string;
    description?: string;
}

export interface JobTitle {
    id: string;
    title: string;
    description?: string;
    departmentId: string;
    baseSalary: number;
}

export const employeeService = {
    getAll: async () => {
        const response = await api.get<Employee[]>('/employees');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Employee>(`/employees/${id}`);
        return response.data;
    },

    create: async (employee: Omit<Employee, 'id' | 'isActive' | 'jobTitleName' | 'departmentName'>) => {
        const response = await api.post<Employee>('/employees', employee);
        return response.data;
    },

    update: async (id: string, employee: Partial<Employee>) => {
        const response = await api.put<Employee>(`/employees/${id}`, employee);
        return response.data;
    },

    getDepartments: async () => {
        const response = await api.get<Department[]>('/employees/departments');
        return response.data;
    },

    getJobTitles: async () => {
        const response = await api.get<JobTitle[]>('/employees/job-titles');
        return response.data;
    },

    createDepartment: async (dept: Omit<Department, 'id'>) => {
        const response = await api.post<Department>('/employees/departments', dept);
        return response.data;
    },

    createJobTitle: async (job: Omit<JobTitle, 'id'> & { baseSalary: number }) => {
        const response = await api.post<JobTitle>('/employees/job-titles', job);
        return response.data;
    }
};

export default employeeService;
