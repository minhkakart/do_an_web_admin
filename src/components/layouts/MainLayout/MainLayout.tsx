'use client'

import React, {useCallback} from 'react';
import Navbar from "~/components/commons/Navbar";
import Header from "~/components/commons/Header";
import {usePathname} from "next/navigation";
import {Menu} from "~/constants/config";

function MainLayout({children}: { children: React.ReactNode}) {
    const getPathTitle = useCallback(
        () => {
            const currentRoute = usePathname().split('/')[1];

            return Menu.find((p) => p.pathActive.some(pa => pa === `/${currentRoute}`))?.title ?? "";
        },
        [usePathname()]
    );

    return (
        <div className="min-h-screen bg-[#f8f8f8] min-w-screen flex flex-row justify-evenly gap-[1px]">
            <nav className="w-[260px] min-w-[240px] flex-shrink-0 min-h-screen top-0 left-0 transition-all ease-in-out">
                <Navbar/>
            </nav>
            <div className="flex flex-col min-h-screen flex-auto">
                <header className="h-[68px] bg-white flex items-center mb-3">
                    <Header title={getPathTitle()} />
                </header>
                <div className="flex-1 p-6 transition-[padding-left] duration-100 ease-in-out">{children}</div>
            </div>
        </div>
    );
}

export default MainLayout;