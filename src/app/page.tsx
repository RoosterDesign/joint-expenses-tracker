'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "@/utils/firebase";

import { ExpensesItem, ExpensesList } from '@/app/types';
import SavingSpinner from '@/components/SavingSpinner';
import EditableExpensesList from '@/components/EditableExpensesList';
import ExpensesSummary, { PersonSpendCards } from '@/components/ExpensesSummary';
import CreateNewExpensesSheet from '@/components/CreateNewExpensesSheet';
import NewExpensesForm from '@/components/NewExpensesForm';

const Home: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [unarchivedList, setUnarchivedList] = useState<ExpensesList | null>(null);
    const [items, setItems] = useState<ExpensesItem[]>([]);

    useEffect(() => {
        const unarchivedQuery = query(collection(db, 'expensesLists'), where("archived", "==", false));
        const unsubscribe: Unsubscribe = onSnapshot(unarchivedQuery, (snapshot) => {
            const lists = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ExpensesList[];

            const list = lists[0] || null;
            setUnarchivedList(list);

            if (list) {
                const itemsCollection = collection(db, "expensesLists", list.id, "items");
                const itemsUnsubscribe = onSnapshot(itemsCollection, (itemsSnapshot) => {
                    const itemsList = itemsSnapshot.docs.map(itemDoc => ({
                        id: itemDoc.id,
                        ...itemDoc.data()
                    })) as ExpensesItem[];

                    const sortedList = itemsList.sort((a, b) =>
                        new Date(b.date).valueOf() - new Date(a.date).valueOf()
                    );
                    setItems(sortedList);
                });
                setLoading(false);
                return () => itemsUnsubscribe();
            } else {
                setItems([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <SavingSpinner label="Loading" />;

    if (!unarchivedList) return <CreateNewExpensesSheet />;

    return (
        <div className="container py-8 lg:py-10">
            {/* Hero row: balance card + person spend cards */}
            <div className="mb-[22px] grid gap-[22px] lg:grid-cols-[1.15fr_1fr]">
                <ExpensesSummary listDetails={unarchivedList} listItems={items} />
                <PersonSpendCards listDetails={unarchivedList} listItems={items} />
            </div>

            {/* Content row: expense feed + add form */}
            <div className="grid gap-[22px] lg:grid-cols-[1.15fr_1fr]">
                <div className="rounded-[22px] border border-white/[0.07] bg-[#141b18] p-6">
                    <EditableExpensesList listDetails={unarchivedList} listItems={items} />
                </div>
                <div className="rounded-[22px] border border-white/[0.07] bg-[#141b18] p-6">
                    <NewExpensesForm listDetails={unarchivedList} />
                </div>
            </div>
        </div>
    );
}

export default Home;
