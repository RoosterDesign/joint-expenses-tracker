'use client';

import React, { useState, useEffect } from "react";
import { collection, onSnapshot, Unsubscribe } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from 'next/link';
import { getExpensesListById } from '@/utils/expensesServices';
import EditableExpensesList from '@/components/EditableExpensesList';
import ExpensesSummary from '@/components/ExpensesSummary';
import { ExpensesItem, ExpensesList } from "@/app/types";
import SavingSpinner from '@/components/SavingSpinner';
import Card from '@/components/Card';

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

        // Get list details
        const loadExpensesList = async () => {
            const expensesList = await getExpensesListById(id);
            setList(expensesList);
        }
        loadExpensesList();

        // Get list items
        const itemsCollection = collection(db, "expensesLists", id, "items");
        const unsubscribe: Unsubscribe = onSnapshot(itemsCollection, (snapshot) => {
            const itemsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ExpensesItem[];

            const sortedList = itemsList.sort((a, b) => {
                return new Date(a.date).valueOf() - new Date(b.date).valueOf()
            });

            setItems(sortedList);
            setLoading(false);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();
    }, [id]);

    if (loading) return <SavingSpinner label="Loading" />;
    if (!list) return <p>List ID not found</p>;

    return (
        <div className="container py-10 lg:py-16">

            <div className="flex flex-col sm:flex-row-reverse mb-6 sm:justify-between sm:items-center">

                <Link href={"/archive"} className="self-start flex items-center bg-primary text-lg text-white border-0 cursor-pointer rounded-md font-bold transition hover:bg-opacity-90 px-5 py-3 fill-white"><svg className="mr-2" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m16.67 0 2.83 2.829-9.339 9.175 9.339 9.167L16.67 24 4.5 12.004z" /></svg>Back to Archive</Link>

                <h1 className="font-bold text-3xl max-sm:mt-5">{list.title}</h1>
            </div>

            <div className="grid gap-6 lg:gap-4 lg:grid-cols-[auto_275px] lg:grid-rows-[auto_1fr] xl:grid-cols-[auto_300px] xl:gap-8 2xl:gap-10 3xl:grid-cols-[auto_350px] items-start">


                <Card>
                    <EditableExpensesList
                        listDetails={list}
                        listItems={items}
                    />
                </Card>


                <div className="lg:col-start-2 lg:col-end-3">
                    <Card>
                        <ExpensesSummary
                            listDetails={list}
                            listItems={items}
                        />
                    </Card>
                </div>

            </div>
        </div>
    )

}

export default ArchiveDetails;
