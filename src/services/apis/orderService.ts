import axiosClient from "~/services";

const orderService = {
    getListPageOrder: (body: {
        isPaging: boolean;
        page: number;
        size: number;
        keyword: string;
    }, token?: any) => {
        return axiosClient.post('/api/v1/Order/get-list-page-order', body, {cancelToken: token});
    },
    updateOrderStatus: (body: { status: number; id: number; }, token?: any) => {
        return axiosClient.post('/api/v1/Order/update-order-status', body, {cancelToken: token});
    },
    getOrderDetail(id: number, token?: any) {
        return axiosClient.get(`/api/v1/Order/detail-order/${id}`, {cancelToken: token});
    }
}
export default orderService;