'use client';

import {PATH} from '~/constants/config';
import {RootState} from '~/redux/store';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useSelector} from 'react-redux';
import Loading from "~/components/commons/Loading";

interface IRequireAuthProps {
    children: React.ReactNode;
}

export default function RequireAuth({children}: IRequireAuthProps) {
    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const userData = useSelector((state: RootState) => state.userData);
    // const isTokenValid = useSelector((state: RootState) => state.isTokenValid);
    // const isCheckingToken = useSelector((state: RootState) => state.isCheckingToken);

    // useEffect(() => {
    //     if (!isTokenValid && !isCheckingToken) {
    //         router.replace(PATH.Login);
    //         return;
    //     }
    // }, [isTokenValid, isCheckingToken]);

    useEffect(() => {
        setChecking(true);
        if (userData === null) {
            router.replace(PATH.Login);
        }
        setChecking(false);

    }, [userData]);

    return (
        checking ?
            <Loading loading={true}/> :
            <>{children}</>
    );
}
