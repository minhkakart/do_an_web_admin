import axiosClient from "~/services";

const sizeService = {
    getListSize: (tokenAxios?: any) => {
        return axiosClient.get(`/api/v1/Size`, {
            cancelToken: tokenAxios,
        });
    }
}

export default sizeService;