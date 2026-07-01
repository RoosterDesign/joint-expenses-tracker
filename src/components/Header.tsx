'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
    const [, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    const isExpenses = pathname === '/';
    const isArchive = pathname.startsWith('/archive');

    const NavToggle = ({ mobile }: { mobile?: boolean }) => (
        <div className={`flex rounded-full border border-white/[0.07] bg-[#141b18] p-1 gap-1 ${mobile ? 'w-full' : ''}`}>
            <Link href="/"
                className={`rounded-full px-5 py-1.5 text-[14px] font-semibold transition ${isExpenses ? 'bg-[#242e29] text-[#eef2f0]' : 'text-[#8a978f] hover:text-[#c3ccc7]'} ${mobile ? 'flex-1 text-center' : ''}`}>
                Expenses
            </Link>
            <Link href="/archive"
                className={`rounded-full px-5 py-1.5 text-[14px] font-semibold transition ${isArchive ? 'bg-[#242e29] text-[#eef2f0]' : 'text-[#8a978f] hover:text-[#c3ccc7]'} ${mobile ? 'flex-1 text-center' : ''}`}>
                Archive
            </Link>
        </div>
    );

    return (
        <header className="w-full border-b border-white/[0.07] bg-[#0c110f]">
            <div className="container">
                {/* Desktop row */}
                <div className="flex h-16 items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <div className="h-[34px] w-[34px] rounded-[11px]"
                             style={{ background: 'linear-gradient(120deg,#a78bfa 0 50%,#fb7185 50% 100%)' }} />
                        <span className="text-[16px]">
                            <span className="font-bold text-[#eef2f0]">Joint</span>
                            <span className="font-medium text-[#7f8c84]"> Expenses</span>
                        </span>
                    </Link>

                    <div className="hidden sm:flex">
                        <NavToggle />
                    </div>

                    <button onClick={handleLogout}
                            className="hidden sm:inline-flex rounded-full border border-white/[0.12] px-5 py-1.5 text-[13px] font-semibold text-[#c3ccc7] hover:text-[#eef2f0] transition">
                        Logout
                    </button>

                    <button onClick={handleLogout} className="sm:hidden text-[13px] font-medium text-[#c3ccc7]">
                        Logout
                    </button>
                </div>

                {/* Mobile nav toggle */}
                <div className="sm:hidden pb-3">
                    <NavToggle mobile />
                </div>
            </div>
        </header>
    );
};

export default Header;
