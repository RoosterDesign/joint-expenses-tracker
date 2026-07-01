'use client';

import { useState } from 'react';
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
            <div className="mx-auto w-full max-w-[340px] self-center -mt-32">
                {/* Logo mark */}
                <div className="mb-8 flex items-center justify-center gap-3">
                    <div className="h-[40px] w-[40px] rounded-[13px]"
                         style={{ background: 'linear-gradient(120deg,#34d399 0 50%,#a78bfa 50% 100%)' }} />
                    <span className="text-[20px]">
                        <span className="font-bold text-[#eef2f0]">Joint</span>
                        <span className="font-medium text-[#7f8c84]"> Expenses</span>
                    </span>
                </div>

                <div className="rounded-[22px] border border-white/[0.07] bg-[#141b18] p-8">
                    <form onSubmit={handleSubmit} className="text-center">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="mb-4 h-[46px] w-full rounded-[13px] border border-white/[0.09] bg-[#0e1512] px-[15px] text-[14px] text-[#eef2f0] outline-none placeholder:text-[#7c887f] focus:border-[rgba(52,211,153,0.35)] transition"
                        />
                        <Button type="submit" fullWidth>Login</Button>
                        {error && <p className="mt-4 text-[13px] font-semibold text-[#fb7185]">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
