import axiosClient from "~/services";

const categoryService = {
    createCategory: (
        data: {
            name: string;
            description: string;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Category/create-category`, data, {
            cancelToken: tokenAxios,
        });
    },
    detailCategory: (
        data: {
            id: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Category/detail-category`, data, {
            cancelToken: tokenAxios,
        });
    },
    updateCategory: (
        data: {
            id: number;
            name: string;
            description: string;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Category/update-category`, data, {
            cancelToken: tokenAxios,
        });
    },
    getListPageCategory: (
        data: {
            "page": number,
            "size": number,
            "keyword": string
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Category/get-list-page-category`, data, {
            cancelToken: tokenAxios,
        });
    },
    getListAllCategory: (
        data: {},
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Category/get-list-all-category`, data, {
            cancelToken: tokenAxios,
        });
    },
};

export default categoryService;