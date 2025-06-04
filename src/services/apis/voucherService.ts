import axiosClient from "~/services";

const voucherService = {
    createVoucher: (
        data: {
            code: string;
            description: string | null;
            value: number;
            discountType: number;
            minOrderValue: number | null;
            limit: number | null;
            startTime: string | null;
            endTime: string | null;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Voucher/create-voucher`, data, {
            cancelToken: tokenAxios,
        });
    },
    getInfoVoucher: (
        data: {
            id: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Voucher/get-info-voucher`, data, {
            cancelToken: tokenAxios,
        });
    },
    updateVoucher: (
        data: {
            id: number;
            name: string;
            description: string;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Voucher/update-voucher`, data, {
            cancelToken: tokenAxios,
        });
    },
    getListPageVoucher: (
        data: {
            page: number,
            size: number,
            keyword: string
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Voucher/get-list-page-voucher`, data, {
            cancelToken: tokenAxios,
        });
    },
};

export default voucherService;