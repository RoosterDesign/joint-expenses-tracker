'use client';

import { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { ExpensesItem, ExpensesList } from '@/app/types';
import { formatNumber, roundToDecimals } from '@/utils/utils';
import Modal from '@/components/Modal';

/*
 * Balance hero + split bar (design 3a / 3b).
 * Drop-in replacement for src/components/ExpensesSummary.tsx.
 *
 * Layout note: in the redesign the hero row is a 2-col grid —
 *   [ <ExpensesSummary> (balance card) | <PersonSpendCards> ]
 * so this file exports BOTH. Place them in page.tsx like:
 *
 *   <div className="grid gap-[22px] lg:grid-cols-[1.15fr_1fr]">
 *     <ExpensesSummary listDetails={list} listItems={items} />
 *     <PersonSpendCards listDetails={list} listItems={items} />
 *   </div>
 *
 * Colours: Neil (user1) = green #34d399, Lou (user2) = violet #a78bfa.
 * The balance figure is tinted with the *owed* person's colour (matches the mock).
 * Tailwind arbitrary values are used so this works before you add tokens to the config.
 */

const NEIL = '#34d399';
const LOU = '#a78bfa';

interface Props {
    listDetails: ExpensesList;
    listItems: ExpensesItem[];
}

function useTotals(listDetails: ExpensesList, listItems: ExpensesItem[]) {
    const { user1Name, user2Name } = listDetails;
    const user1Sum = listItems.reduce((s, i) => s + roundToDecimals(i.user1Spent), 0);
    const user2Sum = listItems.reduce((s, i) => s + roundToDecimals(i.user2Spent), 0);
    const total = user1Sum + user2Sum;
    const equalShare = total / 2;
    const user1Owes = roundToDecimals(equalShare - user1Sum);
    const user2Owes = roundToDecimals(equalShare - user2Sum);

    let ower = '', owed = '', amount = 0, owerIsUser1 = true, settled = false;
    if (user1Owes > 0) { ower = user1Name; owed = user2Name; amount = user1Owes; owerIsUser1 = true; }
    else if (user2Owes > 0) { ower = user2Name; owed = user1Name; amount = user2Owes; owerIsUser1 = false; }
    else { settled = true; }

    const user1Pct = total > 0 ? (user1Sum / total) * 100 : 50;
    const user2Pct = total > 0 ? (user2Sum / total) * 100 : 50;

    return { user1Name, user2Name, user1Sum, user2Sum, total, equalShare, ower, owed, amount, owerIsUser1, settled, user1Pct, user2Pct };
}

/* ---------- Balance card (default export) ---------- */

const ExpensesSummary: React.FC<Props> = ({ listDetails, listItems }) => {
    const t = useTotals(listDetails, listItems);
    const [modalOpen, setModalOpen] = useState(false);

    // figure colour = the person who is OWED
    const figureColor = t.settled ? '#eef2f0' : (t.owerIsUser1 ? LOU : NEIL);

    const handleConfirmSettle = async () => {
        await updateDoc(doc(db, 'expensesLists', listDetails.id), { archived: true });
        setModalOpen(false);
    };

    return (
        <>
            {modalOpen && (
                <Modal>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(52,211,153,0.14)] text-2xl text-[#34d399]">↻</div>
                    <h3 className="mb-3 text-xl font-bold text-[#eef2f0]">Settle up &amp; archive</h3>
                    <p className="mx-auto max-w-96 text-[#8a978f]">Mark this month as paid? It moves to your Archive and a fresh month starts.</p>
                    <div className="mt-6 grid gap-3 md:grid-flow-col">
                        <button onClick={() => setModalOpen(false)} className="order-2 rounded-full border border-white/[0.12] px-8 py-3 font-semibold text-[#c3ccc7] md:order-1">Cancel</button>
                        <button onClick={handleConfirmSettle} className="order-1 rounded-full bg-[#34d399] px-8 py-3 font-bold text-[#06110c] md:order-2">Confirm paid</button>
                    </div>
                </Modal>
            )}

            <div className="relative overflow-hidden rounded-[22px] border border-white/[0.08] p-[28px_30px]"
                 style={{ background: 'radial-gradient(120% 140% at 0% 0%, #16211c 0%, #0e1613 60%)' }}>
                <div className="pointer-events-none absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full"
                     style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.22), transparent 70%)' }} />

                <div className="mb-[10px] text-[13px] text-[#8a978f]">Balance · this month</div>

                {t.settled ? (
                    <>
                        <div className="text-[15px] text-[#c3ccc7]">You&apos;re all square</div>
                        <div className="mb-[22px] mt-2 font-num text-[52px] font-bold leading-none tracking-[-0.03em]"
                             style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: '#eef2f0' }}>£0.00</div>
                    </>
                ) : (
                    <>
                        <div className="text-[15px] text-[#c3ccc7]">{t.ower} owes {t.owed}</div>
                        <div className="mb-[22px] mt-2 font-num text-[66px] font-bold leading-none tracking-[-0.03em]"
                             style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', color: figureColor }}>£{formatNumber(t.amount)}</div>
                    </>
                )}

                {/* split bar */}
                <div className="mb-6">
                    <div className="relative flex h-[14px] overflow-hidden rounded-full">
                        <div style={{ width: `${t.user1Pct}%`, background: NEIL }} />
                        <div style={{ width: `${t.user2Pct}%`, background: LOU }} />
                        <div className="absolute -top-1 -bottom-1 left-1/2 w-0.5 bg-[#eef2f0] opacity-50" />
                    </div>
                    <div className="mt-[11px] flex justify-between text-[12px]">
                        <span className="font-semibold" style={{ color: NEIL }}>{t.user1Name} · £{formatNumber(t.user1Sum)}</span>
                        <span className="text-[#7c887f]">even split at £{formatNumber(t.equalShare)}</span>
                        <span className="font-semibold" style={{ color: LOU }}>{t.user2Name} · £{formatNumber(t.user2Sum)}</span>
                    </div>
                </div>

                {!listDetails.archived && (
                    <button onClick={() => setModalOpen(true)}
                            className="rounded-full bg-[#34d399] px-[26px] py-3 text-[14px] font-bold text-[#06110c]">Settle up</button>
                )}
            </div>
        </>
    );
};

export default ExpensesSummary;

/* ---------- Person-spend cards (right column of the hero) ---------- */

export const PersonSpendCards: React.FC<Props> = ({ listDetails, listItems }) => {
    const t = useTotals(listDetails, listItems);
    const rows = [
        { name: t.user1Name, sum: t.user1Sum, pct: t.user1Pct, color: NEIL, tint: 'rgba(52,211,153,0.15)' },
        { name: t.user2Name, sum: t.user2Sum, pct: t.user2Pct, color: LOU, tint: 'rgba(167,139,250,0.16)' },
    ];
    return (
        <div className="grid grid-rows-2 gap-[14px]">
            {rows.map((r) => (
                <div key={r.name} className="flex items-center gap-[14px] rounded-[18px] border border-white/[0.07] bg-[#141b18] p-[16px_20px]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[13px] text-[18px] font-bold"
                         style={{ background: r.tint, color: r.color, fontFamily: 'var(--font-space-grotesk), sans-serif' }}>{r.name.charAt(0)}</div>
                    <div className="flex-1">
                        <div className="text-[13px] text-[#8a978f]">{r.name} spent</div>
                        <div className="font-num text-[24px] font-semibold tracking-[-0.02em] text-[#eef2f0]"
                             style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>£{formatNumber(r.sum)}</div>
                    </div>
                    <div className="w-[120px]">
                        <div className="h-[7px] overflow-hidden rounded-full bg-[#232b27]">
                            <div className="h-full" style={{ width: `${r.pct}%`, background: r.color }} />
                        </div>
                        <div className="mt-1.5 text-right text-[11px] text-[#7c887f]">{Math.round(r.pct)}% of spend</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
