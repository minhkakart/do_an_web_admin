'use client';

import {KEY_STORAGE_TOKEN, PATH} from '~/constants/config';
import {RootState, store} from '~/redux/store';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';
import {useMutation} from "@tanstack/react-query";
import {httpRequest} from "~/services";
import {IUser, setInfoUser} from "~/redux/reducer/user";
import authService from "~/services/apis/authService";
import {setLoading} from "~/redux/reducer/site";
import {IToken, setAccessToken, setRefreshToken} from "~/redux/reducer/auth";
import {getItemStorage, setItemStorage} from "~/commons/funcs/localStorage";

interface IRequireAuthProps {
    children: React.ReactNode;
}

export default function RequireAuth(props: IRequireAuthProps) {
    const router = useRouter();

    const {infoUser} = useSelector((state: RootState) => state.user);
    const {accessToken} = useSelector((state: RootState) => state.auth);

    const [loadLocalStorage, setLoadLocalStorage] = useState(true);

    const checkToken = useMutation({
        mutationFn: () => httpRequest({
            http: async () => authService.checkToken({}),
        }),
        onSuccess(data: IUser) {
            console.log("RequireAuth checkToken success:", data);
            infoUser === null && store.dispatch(setInfoUser(data));
            console.log("stop loading");
            store.dispatch(setLoading(false));
        },
        onError(error) {
            console.log("RequireAuth checkToken error:", error);
            store.dispatch(setInfoUser(null));
            store.dispatch(setLoading(false));
            router.replace(PATH.Login);
        }
    });

    useEffect(() => {
        const tokenStorage = getItemStorage<IToken>(KEY_STORAGE_TOKEN);
        if (tokenStorage !== null) {
            store.dispatch(setAccessToken(tokenStorage.accessToken));
            store.dispatch(setRefreshToken(tokenStorage.refreshToken));
        }
        setLoadLocalStorage(false);
    }, []);

    useEffect(() => {
        if (loadLocalStorage) {
            return;
        }

        store.dispatch(setLoading(true));
        if (accessToken === null) {
            router.replace(PATH.Login);
            store.dispatch(setLoading(false));
            return;
        }
        if (infoUser === null) {
            store.dispatch(setLoading(true));
            checkToken.mutate();
            return;
        }
        store.dispatch(setLoading(false));

    }, [accessToken, infoUser, loadLocalStorage]);;

    if (infoUser === null) {
        return <div className='loading-page'></div>;
    }

    return <>{props.children}</>;
}
