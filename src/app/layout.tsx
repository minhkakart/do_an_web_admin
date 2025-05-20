import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import AppProvider from "~/contexts/AppProvider";

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
    params: {
        lang: string;
    };
}>) {
  return (
    <html lang="en">
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
