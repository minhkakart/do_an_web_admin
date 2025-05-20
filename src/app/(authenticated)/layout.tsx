'use client';

import React from 'react';
import RequireAuth from "~/components/protected/RequiredAuth";
import MainLayout from "~/components/layouts/MainLayout/MainLayout";

function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <MainLayout>
            <RequireAuth>
                {children}
            </RequireAuth>
        </MainLayout>
    );
}

export default AuthLayout;