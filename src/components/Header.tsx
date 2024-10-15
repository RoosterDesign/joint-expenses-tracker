'use client';

import { useState, useEffect } from "react";
import Link from 'next/link'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from '@/components/Button';
import logo from '/public/images/logo.svg';

const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname])

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/login';
    };

    return (
        <header className={`flex w-full items-center bg-white h-20`}>
            <div className="container">
                <div className="pl-4 relative -mx-4 flex items-center justify-between">
                    <Link href={'/'} className="max-w-[300px] sm:max-w-[200px] w-full block text-lg lg:text-2xl text-black font-bold">
                        <Image src={logo} alt="" width={0} height={0} />
                    </Link>
                    <div className="flex w-full items-center justify-between px-4 z-10">
                        <div>
                            <button
                                onClick={() => setOpen(!open)}
                                id="navbarToggler"
                                className={` ${open && "navbarTogglerActive"
                                    } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                            </button>
                            <nav
                                id="navbarCollapse"
                                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none ${!open && "hidden"
                                    } `}
                            >
                                <ul className="block lg:flex">
                                    <li>
                                        <Link href="/#"
                                            className={` ${pathname === "/" ? "!text-dark" : "text-body-color"} flex py-2 text-base font-[700] hover:text-primary lg:ml-12 lg:inline-flex`}>Expenses List</Link>
                                    </li>
                                    <li>
                                        <Link href="/archive" className={` ${pathname.startsWith("/archive") ? "!text-dark" : "text-body-color"} flex py-2 text-base font-[700] hover:text-primary lg:ml-12 lg:inline-flex`}>Archive</Link>
                                    </li>
                                    <li className="sm:hidden mt-2 border-t pt-4">
                                        <a href="" className="font-bold" onClick={handleLogout}>Logout</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="hidden sm:flex justify-end pr-16 lg:pr-0">
                            <Button onClick={handleLogout} small>Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
