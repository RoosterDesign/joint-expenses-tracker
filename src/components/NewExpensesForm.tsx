'use client';

import { useState } from 'react';
import { addExpense } from '@/utils/expensesServices';
import { ExpensesList, ExpensesItem } from '@/app/types';
import DatePicker from '@/components/DatePicker';
import SavingSpinner from '@/components/SavingSpinner';
import { formatNumber } from '@/utils/utils';

const NEIL = '#34d399';
const LOU = '#a78bfa';
const NEIL_TINT = 'rgba(52,211,153,0.15)';
const LOU_TINT = 'rgba(167,139,250,0.16)';

interface Props {
    listDetails: ExpensesList;
}

type Payer = 'user1' | 'user2';

const NewExpensesForm: React.FC<Props> = ({ listDetails }) => {
    const [date, setDate] = useState(new Date().toLocaleDateString('en-gb'));
    const [name, setName] = useState('');
    const [payer, setPayer] = useState<Payer>('user1');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user1Name, user2Name } = listDetails;
    const nameOfPayer = (p: Payer) => (p === 'user1' ? user1Name : user2Name);
    const colorOfPayer = (p: Payer) => (p === 'user1' ? NEIL : LOU);
    const tintOfPayer = (p: Payer) => (p === 'user1' ? NEIL_TINT : LOU_TINT);

    const half = parseFloat(amount) > 0 ? parseFloat(amount) / 2 : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return setError('Expense name is required.');
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) return setError('Enter an amount above zero.');

        setError('');
        setIsSubmitting(true);

        const [d, m, y] = date.split('/').map((n) => parseInt(n, 10));
        const iso = new Date(y, m - 1, d).toISOString();
        const newExpense: Omit<ExpensesItem, 'id'> = {
            date: iso,
            name: name.trim(),
            user1Spent: payer === 'user1' ? amt : 0,
            user2Spent: payer === 'user2' ? amt : 0,
        };

        await addExpense(listDetails.id, newExpense);
        setName('');
        setAmount('');
        setPayer('user1');
        setDate(new Date().toLocaleDateString('en-gb'));
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            {isSubmitting && <SavingSpinner label="Saving" />}

            <h2 className="mb-5 text-[17px] font-bold text-[#eef2f0]">Add an expense</h2>

            <label className="mb-[7px] block text-[12px] text-[#8a978f]">What was it for?</label>
            <input
                type="text"
                placeholder="e.g. Groceries"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 h-[46px] w-full rounded-[13px] border border-white/[0.09] bg-[#0e1512] px-[15px] text-[14px] text-[#eef2f0] outline-none placeholder:text-[#7c887f] focus:border-[rgba(52,211,153,0.35)] transition"
            />

            <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                    <label className="mb-[7px] block text-[12px] text-[#8a978f]">Date</label>
                    <div className="h-[46px]">
                        <DatePicker onValueChange={setDate} defaultDate={date} sidebar />
                    </div>
                </div>
                <div>
                    <label className="mb-[7px] block text-[12px] text-[#8a978f]">Who paid?</label>
                    <div className="flex h-[46px] gap-1 rounded-[13px] border border-white/[0.09] bg-[#0e1512] p-1">
                        {(['user1', 'user2'] as Payer[]).map((p) => (
                            <button key={p} type="button" onClick={() => setPayer(p)}
                                    className="flex flex-1 items-center justify-center rounded-[10px] text-[13px] font-semibold transition"
                                    style={payer === p ? { background: tintOfPayer(p), color: colorOfPayer(p) } : { color: '#8a978f' }}>
                                {nameOfPayer(p)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <label className="mb-[7px] block text-[12px] text-[#8a978f]">Amount</label>
            <div className="mb-1 flex h-[52px] items-center rounded-[13px] border border-[rgba(52,211,153,0.35)] bg-[#0e1512] px-[15px]">
                <span className="mr-2 text-[18px] font-bold text-[#34d399]" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>£</span>
                <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-[18px] font-semibold text-[#eef2f0] outline-none placeholder:text-[#3d4d46]"
                    style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
                />
            </div>

            {half > 0 && (
                <p className="mb-4 text-[12px] text-[#7c887f]">Split 50 / 50 — each pays £{formatNumber(half)}</p>
            )}
            {!half && <div className="mb-4" />}

            {error && <p className="mb-3 text-[13px] font-semibold text-[#fb7185]">{error}</p>}

            <button type="submit"
                    className="flex h-[50px] w-full items-center justify-center rounded-full bg-[#34d399] text-[15px] font-bold text-[#06110c] transition hover:opacity-90">
                Add expense
            </button>
        </form>
    );
};

export default NewExpensesForm;
