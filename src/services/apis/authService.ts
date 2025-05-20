import {UserRole} from "~/constants/config/enum";
import axiosClient from "~/services";

const authService = {
    login: (
        data: {
            userName: string;
            password: string;
            type: UserRole;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Auth/login`, data, {
            cancelToken: tokenAxios,
        });
    },
    logout: (data: {}, tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Auth/logout`, data, {
            cancelToken: tokenAxios,
        });
    },
    checkToken: (data: {}, tokenAxios?: any) => {
        return axiosClient.post(`/api/v1/Auth/check-token`, data, {
            cancelToken: tokenAxios,
        });
    },
};

export default authService;