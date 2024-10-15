'use client';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Link from 'next/link';
import React, { useState, useEffect } from "react";
import { ExpensesList } from '@/app/types';
import Card from '@/components/Card';

const Archive: React.FC = () => {
    const [archivedLists, setArchivedLists] = useState<ExpensesList[]>([]);

    useEffect(() => {
        const fetchArchivedLists = async () => {
            const q = query(collection(db, "expensesLists"), where("archived", "==", true));
            const querySnapshot = await getDocs(q);
            const lists = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ExpensesList[];
            setArchivedLists(lists);
        };
        fetchArchivedLists();
    }, []);

    return (
        <div className="container py-10 lg:py-16">
            <div className="max-w-[750px] mx-auto">
                <h1 className="font-bold text-2xl mb-6">Archive</h1>
                <Card>

                    {archivedLists.length === 0 && <p className="text-center font-bold">There are no archived expenses sheets.</p>}

                    <ul>
                        {archivedLists.map(list => (
                            <li key={list.id} className="text-lg py-3 border-b-2 last:border-b-0">
                                <Link href={`/archive/${list.id}`} className="font-medium hover:text-primary">{list.title}</Link>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export default Archive;
