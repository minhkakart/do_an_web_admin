// noinspection ExceptionCaughtLocallyJS

import axios from 'axios';
import {toastInfo, toastSuccess, toastWarn} from '~/commons/funcs/toast';
import {store} from '~/redux/store';
import {IBaseResponse, IHttpRequest} from "~/commons/interfaces";
import {setLoading} from "~/redux/reducer/site";
import {setInfoUser} from "~/redux/reducer/user";
import {getItemStorage, setItemStorage} from "~/commons/funcs/localStorage";
import {IToken, setAccessToken, setRefreshToken} from "~/redux/reducer/auth";
import {KEY_STORAGE_TOKEN} from "~/constants/config";

const axiosClient = axios.create({
    headers: {
        'content-type': 'application/json',
    },
    baseURL: process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
    timeout: 60 * 1000,
    timeoutErrorMessage: 'Timeout error request',
});

axiosClient.interceptors.request.use(async (config) => {
    const token = store.getState().auth.accessToken;
    config.headers.Authorization = token ? 'Bearer ' + token : null;

    return config;
});

axiosClient.interceptors.response.use(
    (response: any) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    (error: any) => {
        if (error.response && error.response.data) {
            throw error.response.data;
        }

        if (!axios.isCancel(error)) throw error;
    }
);
export default axiosClient;
/*

export const httpRequest = async ({
                                      http,
                                      showLoading = true,
                                      msgSuccess = 'Thành công',
                                      showMessageSuccess = false,
                                      showMessageFailed = false,
                                      onError
                                  }: IHttpRequest) => {
    showLoading && store.dispatch(setLoading(true));
    try {
        let res: IBaseResponse<any> = await http();

        if (res.error.code === 1) {
            showMessageSuccess && msgSuccess && toastSuccess({msg: msgSuccess || res?.error?.message});
            return res.data || true;
        } else if (res.error.code === 4) {
            const tokenStorage = getItemStorage<IToken | null>(KEY_STORAGE_TOKEN);
            console.log("tokenStorage", tokenStorage);
            if (tokenStorage === null){
                store.dispatch(setInfoUser(null));
                showLoading && store.dispatch(setLoading(false));
                return false;
            }

            const token = await axios.post((process.env.NODE_ENV == 'development' ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCTION) + '/api/v1/Auth/refresh', {}, {
                headers: {
                    authorization: `Bearer ${tokenStorage.refreshToken}`
                }
            });

            if (token?.data?.accessToken && token?.data?.refreshToken) {
                console.log("refresh token success", token.data);
                store.dispatch(setAccessToken(token.data.accessToken));
                store.dispatch(setRefreshToken(token.data.refreshToken));
                setItemStorage(KEY_STORAGE_TOKEN, token.data);

                res = await http();

                if (res.error.code === 1) {
                    showMessageSuccess && msgSuccess && toastSuccess({msg: msgSuccess || res?.error?.message});
                    return res.data || true;
                } else {
                    throw res?.error?.message;
                }
            } else {
                store.dispatch(setInfoUser(null));
                showLoading && store.dispatch(setLoading(false));
                return false;
            }

        } else {
            throw res?.error?.message;
        }
    } catch (err: any) {
        console.log("axiosClient error", err);
        if (err?.status === 401 || err?.error?.code === 3) {
            store.dispatch(setInfoUser(null));
        } else if (err.code == 'ERR_NETWORK' || err.code == 'ECONNABORTED') {
            showMessageFailed && toastInfo({msg: 'Kiểm tra kết nối internet'});
        } else {
            showMessageFailed && toastWarn({msg: err?.error?.message || 'Có lỗi đã xảy ra!'});
        }
        onError && onError(err);
        throw err;
    } finally {
        showLoading && store.dispatch(setLoading(false));
    }
};
*/

export const httpRequest = async ({
                                      http,
                                      showLoading = true,
                                      msgSuccess = 'Thành công',
                                      showMessageSuccess = false,
                                      showMessageFailed = false,
                                      onError
                                  }: IHttpRequest) => {
    showLoading && store.dispatch(setLoading(true));

    try {
        let res: IBaseResponse<any> = await http();

        if (res.error.code === 1) {
            showMessageSuccess && msgSuccess && toastSuccess({msg: msgSuccess || res?.error?.message});
            return res.data || true;
        }

        // Token expired
        /*else if (res.error.code === 4) {
            const tokenStorage = getItemStorage<IToken | null>(KEY_STORAGE_TOKEN);
            if (!tokenStorage) {
                store.dispatch(setInfoUser(null));
                return false;
            }

            try {
                const token = await axios.post(
                    `${process.env.NODE_ENV === 'development'
                        ? process.env.NEXT_PUBLIC_API_URL_DEV
                        : process.env.NEXT_PUBLIC_API_URL_PRODUCTION}/api/v1/Auth/refresh`,
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${tokenStorage.refreshToken}`
                        }
                    }
                );

                const {accessToken, refreshToken} = token?.data || {};

                if (accessToken && refreshToken) {
                    console.log("refresh token success", token.data);
                    store.dispatch(setAccessToken(accessToken));
                    store.dispatch(setRefreshToken(refreshToken));
                    setItemStorage(KEY_STORAGE_TOKEN, {accessToken, refreshToken});

                    const retryRes: IBaseResponse<any> = await http();

                    if (retryRes.error.code === 1) {
                        showMessageSuccess && msgSuccess && toastSuccess({msg: msgSuccess || retryRes?.error?.message});
                        return retryRes.data || true;
                    } else {
                        throw retryRes?.error;
                    }
                } else {
                    store.dispatch(setInfoUser(null));
                    return false;
                }

            } catch (refreshErr) {
                console.log("Refresh token failed", refreshErr);
                store.dispatch(setInfoUser(null));
                return false;
            }

        }*/ else {
            throw res?.error;
        }
    } catch (err: any) {
        console.log("axiosClient error", err);

        if (err?.status === 401 || err?.error?.code === 3) {
            store.dispatch(setInfoUser(null));
        } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
            showMessageFailed && toastInfo({msg: 'Kiểm tra kết nối internet'});
        } else {
            showMessageFailed && toastWarn({msg: err?.error?.message || 'Có lỗi đã xảy ra!'});
        }

        onError?.(err);
        throw err;
    } finally {
        showLoading && store.dispatch(setLoading(false));
    }
};

