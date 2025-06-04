import axiosClient from "~/services";

const employeeService = {
    createEmployee: (
        data: {
            fullname: string;
            username: string;
            gender: number;
            birthDate?: string | null;
            phone?: string | null;
            address?: string | null;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Employee/create-employee`, data, {
            cancelToken: tokenAxios,
        });
    },
    updateEmployee: (
        data: {
            id: number;
            fullname: string;
            gender: number;
            birthDate?: string | null;
            phone?: string | null;
            address?: string | null;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Employee/update-employee`, data, {
            cancelToken: tokenAxios,
        });
    },
    getInfoEmployee: (
        data: {
            id: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Employee/get-info-employee`, data, {
            cancelToken: tokenAxios,
        });
    },
    getListPageEmployee: (
        data: {
            page: number,
            size: number,
            "keyword": string
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Employee/get-list-page-employee`, data, {
            cancelToken: tokenAxios,
        });
    },
    changeLockEmployee: (
        data: {
            id: number;
            isLocked: boolean;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Employee/get-list-page-employee`, data, {
            cancelToken: tokenAxios,
        });
    },
};

export default employeeService;