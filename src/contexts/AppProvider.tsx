'use client';

import {HydrationBoundary, QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';
import {store} from '~/redux/store';

import SplashScreen from '~/components/protected/SplashScreen';
import React from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

function AppProvider({children, pageProps}: {children: React.ReactNode; pageProps: any}) {

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<HydrationBoundary state={pageProps.dehydratedState}>
					<SplashScreen />
					<ToastContainer autoClose={3000} />
					{children}
				</HydrationBoundary>
			</QueryClientProvider>
		</Provider>
	);
}

export default AppProvider;
