'use client';

import React, {useEffect, useState} from 'react';
import {ArrowDown2, Danger, LogoutCurve, UserOctagon} from 'iconsax-react';
import TippyHeadless from '@tippyjs/react/headless';

import {PropsHeader} from './interfaces';
import styles from './Header.module.scss';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import {useRouter} from 'next/navigation';
import clsx from 'clsx';
import Navbar from '../Navbar';
import {useSelector} from 'react-redux';
import {RootState, store} from '~/redux/store';
import Dialog from "~/components/commons/Dialog";
import { useMutation } from '@tanstack/react-query';
import {httpRequest} from "~/services";
import authService from "~/services/apis/authService";
import {logout} from "~/redux/reducer/auth";
import {setInfoUser} from "~/redux/reducer/user";
import {KEY_STORAGE_TOKEN, PATH} from "~/constants/config";
import {isSetIterator} from "node:util/types";
import {setItemStorage} from "~/commons/funcs/localStorage";

;

function Header({title}: PropsHeader) {
    const router = useRouter();

    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [openProfile, setOpenProfile] = useState<boolean>(false);

    const {infoUser} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (openMenu) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'overlay';
        }
    }, [openMenu]);

    useEffect(() => {
        if (openMenu) {
            setOpenMenu(false);
        }
    }, [router]);

    return (
        <div className="h-full w-full px-6 flex items-center justify-between bg-white border border-[#f4f7fa]">
            <div className={styles.control}>
                <Image
                    alt='icon hamburger'
                    src={icons.hamburger}
                    width={20}
                    height={20}
                    className={styles.hamburger}
                    onClick={() => setOpenMenu(true)}
                />
                <h4>{title}</h4>
            </div>
            <div className={styles.main_info}>
                <TippyHeadless
                    maxWidth={'100%'}
                    interactive
                    visible={openProfile}
                    onClickOutside={() => setOpenProfile(false)}
                    placement='bottom-end'
                    render={(attrs: any) => <MenuProfile onClose={() => setOpenProfile(false)}/>}
                >
                    <div className={styles.info} onClick={() => setOpenProfile(!openProfile)}>
                        <div className={styles.box_avatar}>
                            <Image
                                className={styles.avatar_image}
                                src={infoUser?.avatar ? `${process.env.NEXT_PUBLIC_IMAGE}/${infoUser?.avatar}` : icons.avatar}
                                alt='avatar default'
                                width={42}
                                height={42}
                            />
                        </div>
                        <p className={styles.name}>{infoUser?.fullName}</p>
                        <div className={clsx(styles.arrow, {[styles.active]: openProfile})}>
                            <ArrowDown2 size={16} color='#171832'/>
                        </div>
                    </div>
                </TippyHeadless>
            </div>

            {/* Responsive mobile */}
            <div className={clsx(styles.overlay, {[styles.close]: !openMenu})} onClick={() => setOpenMenu(false)}></div>
            <div className={clsx(styles.main_mobile, {[styles.active]: openMenu})}>
                <Navbar/>
            </div>
        </div>
    );
}

export default Header;

function MenuProfile({onClose}: { onClose: () => void }) {
    const [openLogout, setOpenLogout] = useState<boolean>(false);
    const router = useRouter();

    const funcLogout = useMutation({
        mutationFn: () =>
            httpRequest({
                showMessageFailed: true,
                showMessageSuccess: false,
                http: async () => authService.logout({}),
            }),
        onSuccess(data) {
            if (data) {
                store.dispatch(logout());
                store.dispatch(setInfoUser(null));
                setItemStorage(KEY_STORAGE_TOKEN, null);
                router.push(PATH.Login);
            }
        },
    });

    const handleLogout = () => {
        return funcLogout.mutate();
    };
    return (
        <div className="bg-white rounded-lg shadow-sm" tabIndex={-1} onClick={onClose}>
            <div className="flex flex-col">
                <div className="flex items-center justify-start p-4 hover:cursor-pointer hover:bg-[#f8f8f8] transition-all duration-200 ease-in-out">
                    <UserOctagon size={20} color="#777e90" className="mr-2"/>
                    <p>
                        Thông tin tài khoản
                    </p>
                </div>
                <div className="border-b border-b-neutral-500"></div>
                <div className="flex items-center justify-start p-4 hover:cursor-pointer hover:bg-[#f8f8f8] transition-all duration-200 ease-in-out"
                     onClick={() => {
                         setOpenLogout(true);
                         onClose();
                     }}
                >
                    <LogoutCurve size={20} color="#777e90" className="mr-2"/>
                    <p>
                        Đăng xuất
                    </p>
                </div>
            </div>
            <Dialog
                open={openLogout}
                onClose={() => setOpenLogout(false)}
                onSubmit={handleLogout}
                title='Đăng xuất'
                note='Bạn có muốn đăng xuất khỏi hệ thống không?'
                icon={<Danger size='76' color='#F46161' variant='Bold' />}
                titleCancel='Không'
                titleSubmit='Đăng xuất'
                type='error'
            />
        </div>
    );
}