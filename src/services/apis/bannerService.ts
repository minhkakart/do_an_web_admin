import axiosClient from "~/services";

const bannerService = {
    getListPageBanner: (
        data: {
            page: number;
            size: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post('/api/v1/Banner/get-list-page-banner', data, {
            cancelToken: tokenAxios,
        });
    },
    upsertBanner: (
        data: {
            id: number | null;
            imageUrl: string;
            order: number;
            isActive: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post('/api/v1/Banner/upsert-banner', data, {
            cancelToken: tokenAxios,
        });
    },
    deleteBanner: (
        data: {
            id: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post('/api/v1/Banner/delete-banner', data, {
            cancelToken: tokenAxios,
        });
    },
}

export default bannerService;