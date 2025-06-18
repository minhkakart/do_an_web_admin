import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React, {use} from "react";
import AppProvider from "~/contexts/AppProvider";
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-share.css';
import 'react-toastify/dist/ReactToastify.css';
import 'tippy.js/dist/tippy.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/_globals.scss';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quản lý cửa hàng",
  description: "Quản lý cửa hàng Enjoy your drinks",
};

// @ts-ignore
export default function RootLayout({
  children, params
}: Readonly<{
  children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>) {
    const {lang} = use(params);
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AppProvider pageProps={params}>
        {children}
      </AppProvider>
      </body>
    </html>
  );
}
