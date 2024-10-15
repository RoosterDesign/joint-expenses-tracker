import { cookies } from 'next/headers';
import type { Metadata } from "next";
import { Roboto } from 'next/font/google'
import Header from '@/components/Header';
import "./globals.css";

const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '400', '500', '700', '900']
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = cookies();
    const isAuth = cookieStore.get('isAuth')?.value === 'true';
    return (
        <html lang="en">
            <body
                className={`${roboto.className} bg-gray-2`}
            >
                <div className="min-h-screen flex flex-col">
                    {isAuth && <Header />}
                    {children}
                </div>
            </body>
        </html>
    );
}
