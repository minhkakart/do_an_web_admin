'use client';

import React from 'react';
import RequireAuth from "~/components/protected/RequiredAuth";
import MainLayout from "~/components/layouts/MainLayout/MainLayout";

function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <RequireAuth>
            <MainLayout>
                {children}
            </MainLayout>
        </RequireAuth>
    );
}

export default AuthLayout;