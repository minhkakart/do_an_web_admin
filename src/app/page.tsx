import Overview from "~/app/(authenticated)/overview/page";
import RequireAuth from "~/components/protected/RequiredAuth";
import MainLayout from "~/components/layouts/MainLayout/MainLayout";
import React from "react";

export default function App() {
    return (
        <MainLayout>
            <RequireAuth>
                <Overview/>
            </RequireAuth>
        </MainLayout>
    );
}
