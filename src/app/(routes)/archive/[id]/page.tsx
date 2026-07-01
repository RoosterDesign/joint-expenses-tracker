'use client';

import React, { useState, useEffect } from "react";
import { collection, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from 'next/link';
import { getExpensesListById } from '@/utils/expensesServices';
import EditableExpensesList from '@/components/EditableExpensesList';
import ExpensesSummary, { PersonSpendCards } from '@/components/ExpensesSummary';
import { ExpensesItem, ExpensesList } from "@/app/types";
import SavingSpinner from '@/components/SavingSpinner';

interface Props {
    params: { id: string }
}

const ArchiveDetails: React.FC<Props> = ({ params }) => {
    const { id } = params;
    const [list, setList] = useState<ExpensesList | null>(null);
    const [items, setItems] = useState<ExpensesItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!id) return;

        const loadExpensesList = async () => {
            const expensesList = await getExpensesListById(id);
            setList(expensesList);
        }
        loadExpensesList();

        const itemsCollection = collection(db, "expensesLists", id, "items");
        const unsubscribe: Unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
            const itemsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ExpensesItem[];

            const sortedList = itemsList.sort((a, b) =>
                new Date(b.date).valueOf() - new Date(a.date).valueOf()
            );
            setItems(sortedList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [id]);

    if (loading) return <SavingSpinner label="Loading" />;
    if (!list) return <p className="p-8 text-center text-[#8a978f]">List not found.</p>;

    return (
        <div className="container py-8 lg:py-10">
            {/* Back nav */}
            <div className="mb-6 flex items-center gap-2 text-[13px] text-[#8a978f]">
                <Link href="/archive" className="hover:text-[#eef2f0] transition">Archive</Link>
                <span>›</span>
                <span className="text-[#eef2f0]">{list.title}</span>
            </div>

            {/* Hero row */}
            <div className="mb-[22px] grid gap-[22px] lg:grid-cols-[1.15fr_1fr]">
                <ExpensesSummary listDetails={list} listItems={items} />
                <PersonSpendCards listDetails={list} listItems={items} />
            </div>

            {/* Expense feed */}
            <div className="mx-auto max-w-[720px] rounded-[22px] border border-white/[0.07] bg-[#141b18] p-6">
                <EditableExpensesList listDetails={list} listItems={items} />
            </div>
        </div>
    );
}

export default ArchiveDetails;
