import axiosClient from "~/services";
import {toQueryString} from "~/commons/funcs/optionConvert";

const overviewService = {
    getOverview(query: {
        fromDate: string | null;
        toDate: string | null;
    }, token?: any) {
        return axiosClient.get(`/api/v1/Overview${toQueryString(query)}`, {cancelToken: token});
    }
}

export default overviewService;