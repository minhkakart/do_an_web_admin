'use client';

import React, {useCallback} from 'react';

import {PropsNavbar} from './interfaces';
import styles from './Navbar.module.scss';
import Link from 'next/link';
import {Menu, PATH} from '~/constants/config';
import Image from 'next/image';
import icons from '~/constants/images/icons';
import clsx from 'clsx';
import {usePathname} from 'next/navigation';

function Navbar({}: PropsNavbar) {

    const checkActive = useCallback(
        (pathNames: Array<string>) => {
            const currentRoute = usePathname().split('/')[1];

            return pathNames.some((p : string) => p === `/${currentRoute}`);
        },
        [usePathname()]
    );

    return (
        <div className={styles.container}>
            <Link href={PATH.Home} className="flex flex-row py-3 w-full items-center justify-center">
                <Image alt='Logo' src={icons.logo} width={100} height={100} className="w-[60px] h-[60px]"/>
                <p className="font-bold uppercase">
                    Quản lí cửa hàng
                </p>
            </Link>
            <div className={styles.menus}>
                {Menu.map((menu, i) => (
                    <div key={i} className={styles.menu}>
                        <Link key={i} href={menu.path}
                              className={clsx(styles.tab, {[styles.active]: checkActive(menu.pathActive)})}>
                            <menu.icon size={22} className={styles.icon}/>
                            <p>{menu.title}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Navbar;
