'use client';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from 'next/link';
import React, { useState, useEffect } from "react";
import { ExpensesItem, ExpensesList } from '@/app/types';
import { formatNumber, roundToDecimals } from '@/utils/utils';

const NEIL = '#34d399';
const LOU = '#a78bfa';

interface ArchivedList extends ExpensesList {
    items: ExpensesItem[];
}

function computeBalance(list: ArchivedList) {
    const { user1Name, user2Name } = list;
    const user1Sum = list.items.reduce((s, i) => s + roundToDecimals(i.user1Spent), 0);
    const user2Sum = list.items.reduce((s, i) => s + roundToDecimals(i.user2Spent), 0);
    const total = user1Sum + user2Sum;
    const equalShare = total / 2;
    const user1Owes = roundToDecimals(equalShare - user1Sum);
    const user2Owes = roundToDecimals(equalShare - user2Sum);

    if (user1Owes > 0) return { ower: user1Name, owed: user2Name, amount: user1Owes, owerColor: NEIL, total };
    if (user2Owes > 0) return { ower: user2Name, owed: user1Name, amount: user2Owes, owerColor: LOU, total };
    return { ower: '', owed: '', amount: 0, owerColor: NEIL, total };
}

function parseTitle(title: string) {
    const parts = title.trim().split(' ');
    return { month: (parts[0] || '').slice(0, 3), year: parts[1] || '' };
}

const Archive: React.FC = () => {
    const [archivedLists, setArchivedLists] = useState<ArchivedList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArchivedLists = async () => {
            const q = query(collection(db, "expensesLists"), where("archived", "==", true));
            const querySnapshot = await getDocs(q);

            const lists = await Promise.all(
                querySnapshot.docs.map(async (docSnap) => {
                    const data = docSnap.data();
                    const itemsSnap = await getDocs(collection(db, "expensesLists", docSnap.id, "items"));
                    const items = itemsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ExpensesItem[];
                    return {
                        id: docSnap.id,
                        title: data.title,
                        user1Name: data.user1Name,
                        user2Name: data.user2Name,
                        archived: data.archived,
                        items,
                    } as ArchivedList;
                })
            );

            lists.sort((a, b) => b.title.localeCompare(a.title));
            setArchivedLists(lists);
            setLoading(false);
        };
        fetchArchivedLists();
    }, []);

    const totalSettled = archivedLists.reduce((s, l) => s + computeBalance(l).total, 0);

    return (
        <div className="container py-8 lg:py-10">
            <div className="mx-auto max-w-[680px]">

                {/* Page header */}
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-[22px] font-bold text-[#eef2f0]">Archive</h1>
                        <p className="mt-1 text-[13px] text-[#8a978f]">Months you&apos;ve settled up</p>
                    </div>
                    {archivedLists.length > 0 && (
                        <span className="text-[12px] text-[#7c887f]">
                            {archivedLists.length} settled · £{formatNumber(totalSettled)} total
                        </span>
                    )}
                </div>

                {loading && (
                    <p className="text-center text-[14px] text-[#8a978f]">Loading…</p>
                )}

                {!loading && archivedLists.length === 0 && (
                    <div className="rounded-[22px] border border-white/[0.07] bg-[#141b18] p-8 text-center text-[14px] text-[#8a978f]">
                        No archived months yet. Settle up to archive this month.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {archivedLists.map((list) => {
                        const bal = computeBalance(list);
                        const { month, year } = parseTitle(list.title);
                        const allSquare = bal.amount === 0;

                        return (
                            <div key={list.id} className="rounded-[22px] border border-white/[0.07] bg-[#141b18] p-5">
                                {/* Top row: chip + title/meta + view */}
                                <div className="flex items-center gap-4">
                                    {/* Month chip */}
                                    <div className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-[14px] border border-white/[0.09] bg-[#0e1512]">
                                        <span className="text-[18px] font-bold leading-none text-[#eef2f0]"
                                              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                                            {month}
                                        </span>
                                        <span className="mt-[3px] text-[10px] text-[#7c887f]">{year}</span>
                                    </div>

                                    {/* Title + count */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[16px] font-semibold text-[#eef2f0]">{list.title}</div>
                                        <div className="mt-[3px] text-[12px] text-[#8a978f]">
                                            {list.items.length} expenses · £{formatNumber(bal.total)} total
                                        </div>
                                    </div>

                                    {/* View */}
                                    <Link href={`/archive/${list.id}`}
                                          className="shrink-0 rounded-full border border-white/[0.12] px-4 py-[6px] text-[13px] font-semibold text-[#c3ccc7] hover:text-[#eef2f0] transition">
                                        View
                                    </Link>
                                </div>

                                {/* Bottom row: settled label + ower info + paid pill */}
                                <div className="mt-[14px] flex items-center gap-3 pl-[68px]">
                                    <span className="text-[12px] font-medium text-[#8a978f]">Settled</span>
                                    <span className="text-[#3d4d46]">·</span>

                                    {allSquare ? (
                                        <span className="text-[12px] font-semibold text-[#34d399]">All square</span>
                                    ) : (
                                        <span className="text-[12px] text-[#8a978f]">
                                            <span className="font-semibold" style={{ color: bal.owerColor }}>{bal.ower}</span>
                                            {' '}owed {bal.owed}{' '}
                                            <span className="font-semibold" style={{ color: bal.owerColor }}>
                                                £{formatNumber(bal.amount)}
                                            </span>
                                        </span>
                                    )}

                                    {/* Green "Paid" pill */}
                                    <span className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-[4px] text-[11.5px] font-semibold text-[#34d399]"
                                          style={{ background: 'rgba(52,211,153,0.12)' }}>
                                        <span className="h-[6px] w-[6px] rounded-full bg-[#34d399]" />
                                        Paid
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Archive;
