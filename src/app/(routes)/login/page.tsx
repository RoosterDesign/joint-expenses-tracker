'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/Card';
import logo from '/public/images/logo.svg';
import Button from '@/components/Button';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const res = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            window.location.href = '/';
        } else {
            setError('Incorrect password');
        }
    };

    return (

        <div className="container flex flex-1">
            <div className="w-full max-w-[350px] mx-auto items-center self-center -mt-96">
                <div className="flex justify-center mb-12 w-[300px] mx-auto">
                    <Image src={logo} alt="" width={0} height={0} className="w-full" />
                </div>
                <Card>
                    <form onSubmit={handleSubmit} className="text-center">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full h-12 bg-transparent rounded-md border border-stroke py-[10px] px-5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                        />
                        <Button type="submit" className="w-full mt-6">Login</Button>
                        {error && <p className="mt-6 text-lg font-bold text-red-600">{error}</p>}
                    </form>
                </Card>
            </div>
        </div>


    )
}

export default Login;
