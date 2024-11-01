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
    title: "Joint Expenses Tracker",
    description: "Joint Expenses Tracker helps you track your joint expenses and see who owes who!",
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
            <head>
                <link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="JET" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
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
