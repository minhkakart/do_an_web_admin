//**********************
//* COMPONENT PROTECTED SCREEN THEN LOGIN
//**********************

'use client';

import React, {useEffect} from "react";

import {RootState} from "~/redux/store";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";

interface props {
    children: React.ReactNode;
}

function RequiredLogout({children}: props) {
    const {replace} = useRouter();
    const {loading} = useSelector((state: RootState) => state.site);
    const {infoUser} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        (async () => {
            if (infoUser !== null && !loading) await replace("/");
        })();
    }, [infoUser, loading, replace]);

    if (infoUser === null && !loading) {
        return <>{children}</>;
    }

    return <div className="loading-page"></div>;
}

export default RequiredLogout;
