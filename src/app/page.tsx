'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, query, where, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "@/utils/firebase";

import { ExpensesItem, ExpensesList } from '@/app/types';
import SavingSpinner from '@/components/SavingSpinner';
import EditableExpensesList from '@/components/EditableExpensesList';
import ExpensesSummary from '@/components/ExpensesSummary';
import CreateNewExpensesSheet from '@/components/CreateNewExpensesSheet';
import Card from '@/components/Card';
import NewExpensesForm from '@/components/NewExpensesForm';

const Home: React.FC = () => {
    const itemDateInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [unarchivedList, setUnarchivedList] = useState<ExpensesList | null>(null);
    const [items, setItems] = useState<ExpensesItem[]>([]);

    // Read items from database
    useEffect(() => {
        if (itemDateInputRef.current) {
            itemDateInputRef.current.focus();
        }
        const unarchivedQuery = query(collection(db, 'expensesLists'), where("archived", "==", false));
        const unsubscribe: Unsubscribe = onSnapshot(unarchivedQuery, (snapshot) => {
            const lists = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ExpensesList[];

            // Set the first unarchived list (there should be only one)
            const list = lists[0] || null;

            setUnarchivedList(list);

            // Fetch list items if there is an unarchived list
            if (list) {
                const itemsCollection = collection(db, "expensesLists", list.id, "items");

                const itemsUnsubscribe = onSnapshot(itemsCollection, (itemsSnapshot) => {
                    const itemsList = itemsSnapshot.docs.map(itemDoc => ({
                        id: itemDoc.id,
                        ...itemDoc.data()
                    })) as ExpensesItem[];

                    // Sort data by date order
                    const sortedList = itemsList.sort((a, b) => {
                        return new Date(b.date).valueOf() - new Date(a.date).valueOf()
                    });

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

    return (
        unarchivedList ? (
            <div className="container py-10 lg:py-16">
                <div className="grid gap-6 lg:gap-4 lg:grid-cols-[auto_275px] lg:grid-rows-[auto_1fr] xl:grid-cols-[auto_300px] xl:gap-8 2xl:gap-10 3xl:grid-cols-[auto_350px]">
                    <div className="">
                        <Card>
                            <NewExpensesForm
                                listDetails={unarchivedList}
                            />
                        </Card>
                    </div>

                    <div className="lg:row-start-1 lg:row-end-3">
                        <Card>
                            <EditableExpensesList
                                listDetails={unarchivedList}
                                listItems={items}
                            />
                        </Card>
                    </div>



                    <div className="lg:col-start-2 lg:col-end-3 lg:row-start-2">
                        <Card>
                            <ExpensesSummary
                                listDetails={unarchivedList}
                                listItems={items}
                            />
                        </Card>
                    </div>

                </div>
            </div>
        ) : <CreateNewExpensesSheet />
    );
}

export default Home;
