import axiosClient from "~/services";

const productService = {
    createProduct: (
        data: {
            name: string;
            description: string;
            price: number;
            discount: number | null;
            discountType: number | null;
            bestSell: number;
            remarked: number;
            sizePrices: {
                sizeId: number,
                price: number
            }[];
            imageUrls: string[];
            categoryIds: number[];
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Product/create-product`, data, {
            cancelToken: tokenAxios,
        });
    },
    updateProduct: (
        data: {
            id: number;
            name: string;
            description: string;
            price: number;
            discount: number | null;
            discountType: number | null;
            bestSell: number;
            remarked: number;
            sizePrices: {
                sizeId: number,
                price: number
            }[];
            imageUrls: string[];
            categoryIds: number[];
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Product/update-product`, data, {
            cancelToken: tokenAxios,
        });
    },
    detailProduct: (
        data: {
            id: number;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Product/detail-product`, data, {
            cancelToken: tokenAxios,
        });
    },
    getLisPageProduct: (
        data: {
            page: number;
            size: number;
            keyword: string;
            available: number | null;
            discounting: boolean | null;
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Product/get-list-page-products`, data, {
            cancelToken: tokenAxios,
        });
    },
    changeAvailableProduct: (
        data: {
            id:number
            isAvailable: number
        },
        tokenAxios?: any
    ) => {
        return axiosClient.post(`/api/v1/Product/change-product-available`, data, {
            cancelToken: tokenAxios,
        });
    },
};

export default productService;