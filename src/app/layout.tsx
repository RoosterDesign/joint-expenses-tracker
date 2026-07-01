import { cookies } from 'next/headers';
import type { Metadata } from "next";
import { Instrument_Sans, Space_Grotesk } from 'next/font/google';
import Header from '@/components/Header';
import "./globals.css";

const instrumentSans = Instrument_Sans({
    subsets: ['latin'],
    display: 'swap',
    weight: ['400', '500', '600', '700'],
    variable: '--font-instrument-sans',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    display: 'swap',
    weight: ['600', '700'],
    variable: '--font-space-grotesk',
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
            <body className={`${instrumentSans.variable} ${spaceGrotesk.variable}`}>
                <div className="min-h-screen flex flex-col bg-[#0c110f] text-[#eef2f0]" style={{ fontFamily: 'var(--font-instrument-sans), sans-serif' }}>
                    {isAuth && <Header />}
                    {children}
                </div>
            </body>
        </html>
    );
}
