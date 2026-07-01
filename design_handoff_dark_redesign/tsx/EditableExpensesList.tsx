'use client';

import { useEffect, useRef, useState } from 'react';
import { deleteExpense, updateExpense } from '@/utils/expensesServices';
import { formatNumber } from '@/utils/utils';
import { ExpensesItem, ExpensesList } from '@/app/types';
import DatePicker from '@/components/DatePicker';
import Modal from '@/components/Modal';
import SavingSpinner from '@/components/SavingSpinner';

/*
 * Expense feed + ⋯ menu + edit sheet + delete confirm (design 3a / 3c).
 * Drop-in replacement for src/components/EditableExpensesList.tsx.
 *
 * Colours: Neil (user1) = green, Lou (user2) = violet. "Who paid" = whichever
 * of user1Spent / user2Spent is non-zero. Half = (user1Spent + user2Spent) / 2.
 * Keeps the existing updateExpense / deleteExpense services and the ExpensesItem model.
 */

const NEIL = '#34d399';
const LOU = '#a78bfa';
const NEIL_TINT = 'rgba(52,211,153,0.15)';
const LOU_TINT = 'rgba(167,139,250,0.16)';

interface Props {
    listDetails?: ExpensesList;
    listItems: ExpensesItem[];
}

type Payer = 'user1' | 'user2';
interface EditState { id: string; name: string; date: string; payer: Payer; amount: string; }

const EditableExpensesList: React.FC<Props> = ({ listDetails, listItems }) => {
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [edit, setEdit] = useState<EditState | null>(null);
    const [deleting, setDeleting] = useState<ExpensesItem | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const menuRef = useRef<HTMLDivElement | null>(null);

    // close ⋯ menu on outside click
    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpenId(null);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    if (!listDetails) return null;
    const { user1Name, user2Name } = listDetails;

    const payerOf = (i: ExpensesItem): Payer => (i.user1Spent > 0 ? 'user1' : 'user2');
    const amountOf = (i: ExpensesItem) => i.user1Spent + i.user2Spent;
    const halfOf = (i: ExpensesItem) => amountOf(i) / 2;
    const nameOfPayer = (p: Payer) => (p === 'user1' ? user1Name : user2Name);
    const colorOfPayer = (p: Payer) => (p === 'user1' ? NEIL : LOU);
    const tintOfPayer = (p: Payer) => (p === 'user1' ? NEIL_TINT : LOU_TINT);

    const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-gb', { weekday: 'short', day: '2-digit', month: 'short' });
    const total = listItems.reduce((s, i) => s + amountOf(i), 0);

    const openEdit = (i: ExpensesItem) => {
        setMenuOpenId(null);
        setEdit({
            id: i.id, name: i.name, payer: payerOf(i),
            amount: String(amountOf(i)),
            date: new Date(i.date).toLocaleDateString('en-gb'), // dd/mm/yyyy for DatePicker
        });
        setError('');
    };

    const handleSave = async () => {
        if (!edit) return;
        const amt = parseFloat(edit.amount);
        if (!edit.name.trim()) return setError('Please enter a name.');
        if (!amt || amt <= 0) return setError('Enter an amount above zero.');

        setIsSaving(true);
        const [d, m, y] = edit.date.split('/').map((n) => parseInt(n, 10));
        const iso = new Date(y, m - 1, d).toISOString();
        const item: ExpensesItem = {
            id: edit.id, name: edit.name.trim(), date: iso,
            user1Spent: edit.payer === 'user1' ? amt : 0,
            user2Spent: edit.payer === 'user2' ? amt : 0,
        };
        await updateExpense(listDetails.id, item);
        setIsSaving(false);
        setEdit(null);
    };

    const handleDelete = async () => {
        if (!deleting) return;
        await deleteExpense(listDetails.id, deleting.id);
        setDeleting(null);
    };

    return (
        <>
            {/* EDIT SHEET */}
            {edit && (
                <Modal>
                    {isSaving && <SavingSpinner label="Saving" />}
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-[17px] font-bold text-[#eef2f0]">Edit expense</h3>
                        <button onClick={() => setEdit(null)} className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[#1b231f] text-[#8a978f]">✕</button>
                    </div>

                    <label className="mb-[7px] block text-[12px] text-[#8a978f]">What was it for?</label>
                    <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })}
                           className="mb-4 h-[46px] w-full rounded-[13px] border border-white/[0.09] bg-[#0e1512] px-[15px] text-[14px] text-[#eef2f0] outline-none" />

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-[7px] block text-[12px] text-[#8a978f]">Date</label>
                            <div className="h-[46px]"><DatePicker onValueChange={(v: string) => setEdit({ ...edit, date: v })} defaultDate={edit.date} /></div>
                        </div>
                        <div>
                            <label className="mb-[7px] block text-[12px] text-[#8a978f]">Who paid?</label>
                            <div className="flex h-[46px] gap-1 rounded-[13px] border border-white/[0.09] bg-[#0e1512] p-1">
                                {(['user1', 'user2'] as Payer[]).map((p) => (
                                    <button key={p} onClick={() => setEdit({ ...edit, payer: p })}
                                            className="flex flex-1 items-center justify-center rounded-[10px] text-[13px] font-semibold"
                                            style={edit.payer === p ? { background: tintOfPayer(p), color: colorOfPayer(p) } : { color: '#8a978f' }}>
                                        {nameOfPayer(p)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <label className="mb-[7px] block text-[12px] text-[#8a978f]">Amount</label>
                    <div className="mb-[22px] flex h-[52px] items-center rounded-[13px] border border-[rgba(52,211,153,0.35)] bg-[#0e1512] px-[15px]">
                        <span className="mr-2 font-num text-[18px] font-bold text-[#34d399]" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>£</span>
                        <input type="number" step="any" min="0" value={edit.amount} onChange={(e) => setEdit({ ...edit, amount: e.target.value })}
                               className="w-full bg-transparent font-num text-[18px] font-semibold text-[#eef2f0] outline-none" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }} />
                    </div>

                    {error && <p className="mb-3 text-[13px] font-semibold text-[#fb7185]">{error}</p>}

                    <div className="mb-[14px] flex gap-[10px]">
                        <button onClick={handleSave} className="flex h-[50px] flex-1 items-center justify-center rounded-full bg-[#34d399] text-[15px] font-bold text-[#06110c]">Save changes</button>
                        <button onClick={() => setEdit(null)} className="h-[50px] rounded-full border border-white/[0.12] px-[22px] text-[14px] font-semibold text-[#c3ccc7]">Cancel</button>
                    </div>
                    <button onClick={() => { const item = listItems.find((i) => i.id === edit.id) || null; setEdit(null); setDeleting(item); }}
                            className="w-full text-center text-[13px] font-semibold text-[#fb7185]">Delete this expense</button>
                </Modal>
            )}

            {/* DELETE CONFIRM */}
            {deleting && (
                <Modal>
                    <div className="mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[rgba(251,113,133,0.14)] text-[22px] text-[#fb7185]">✕</div>
                    <h3 className="mb-2 text-center text-[18px] font-bold text-[#eef2f0]">Delete this expense?</h3>
                    <p className="mb-[22px] text-center text-[13.5px] leading-relaxed text-[#8a978f]">
                        &quot;{deleting.name} · £{formatNumber(amountOf(deleting))}&quot; will be removed for both of you. This can&apos;t be undone.
                    </p>
                    <button onClick={handleDelete} className="mb-2.5 flex h-[50px] w-full items-center justify-center rounded-full bg-[#fb7185] text-[15px] font-bold text-[#1a0509]">Delete expense</button>
                    <button onClick={() => setDeleting(null)} className="flex h-[50px] w-full items-center justify-center rounded-full border border-white/[0.12] text-[14px] font-semibold text-[#c3ccc7]">Keep it</button>
                </Modal>
            )}

            {/* FEED */}
            <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-[17px] font-bold text-[#eef2f0]">This month</h2>
                <span className="text-[12px] text-[#7c887f]">{listItems.length} expenses · £{formatNumber(total)} total</span>
            </div>

            {listItems.length === 0 && <p className="mt-5 text-center font-semibold text-[#8a978f]">Add your first expense.</p>}

            <div className="flex flex-col gap-2">
                {listItems.map((item) => {
                    const p = payerOf(item);
                    const open = menuOpenId === item.id;
                    return (
                        <div key={item.id}
                             className="relative flex items-center gap-[15px] rounded-[15px] p-[14px_16px]"
                             style={open ? { background: '#141d18', border: '1px solid rgba(52,211,153,0.25)' } : { background: '#111815' }}>
                            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[12px] text-[15px] font-bold"
                                 style={{ background: tintOfPayer(p), color: colorOfPayer(p), fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                                {nameOfPayer(p).charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-semibold text-[#eef2f0]">{item.name}</div>
                                <div className="mt-0.5 text-[12.5px] text-[#7c887f]">{fmtDate(item.date)} · {nameOfPayer(p)} paid</div>
                            </div>
                            <div className="text-right">
                                <div className="font-num text-[16px] font-semibold text-[#eef2f0]" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>£{formatNumber(amountOf(item))}</div>
                                <div className="mt-0.5 text-[11.5px] text-[#7c887f]">your half £{formatNumber(halfOf(item))}</div>
                            </div>

                            <button onClick={() => setMenuOpenId(open ? null : item.id)}
                                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] text-[16px] tracking-widest"
                                    style={open ? { background: '#242e29', color: '#eef2f0' } : { background: '#1b231f', color: '#8a978f' }}>⋯</button>

                            {open && (
                                <div ref={menuRef} className="absolute right-3 top-[60px] z-10 w-[170px] rounded-[14px] border border-white/10 bg-[#1a221e] p-1.5"
                                     style={{ boxShadow: '0 18px 40px rgba(0,0,0,0.45)' }}>
                                    <button onClick={() => openEdit(item)} className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-medium text-[#eef2f0] hover:bg-white/5">
                                        <span className="text-[14px]">✎</span> Edit expense
                                    </button>
                                    <button onClick={() => { setMenuOpenId(null); setDeleting(item); }} className="flex w-full items-center gap-2.5 rounded-[10px] bg-[rgba(251,113,133,0.1)] px-3 py-2.5 text-left text-[13.5px] font-medium text-[#fb7185]">
                                        <span className="text-[13px]">✕</span> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default EditableExpensesList;
