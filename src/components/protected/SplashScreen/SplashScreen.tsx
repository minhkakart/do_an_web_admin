'use client';

import {Fragment} from 'react';
import {RootState} from '~/redux/store';

import Lottie from 'react-lottie';

import {PropsSplashScreen} from './interfaces';
import clsx from 'clsx';
import styles from './SplashScreen.module.scss';
import {useSelector} from 'react-redux';

import * as loading from '../../../../public/static/anim/loadingScreen.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

function SplashScreen({}: PropsSplashScreen) {
    const {loading} = useSelector((state: RootState) => state.site);
    return (
        <Fragment>
            <div className={clsx(styles.container, {[styles.close]: !loading})}>
                <div className={styles.logo}>
                    <Lottie options={defaultOptions}/>
                </div>
            </div>
        </Fragment>
    );
}

export default SplashScreen;
