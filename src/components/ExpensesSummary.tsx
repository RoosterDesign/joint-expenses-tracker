'use client';

import { useEffect, useState } from 'react';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { ExpensesItem, ExpensesList } from '@/app/types';
import { formatNumber, roundToDecimals } from '@/utils/utils';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface Props {
    listDetails: ExpensesList;
    listItems: ExpensesItem[];
    // user1Name: string;
    // user2Name: string;
}

// const ExpensesSummary: React.FC<Props> = ({ listItems, user1Name, user2Name }) => {
const ExpensesSummary: React.FC<Props> = ({ listDetails, listItems }) => {

    const { user1Name, user2Name, archived } = listDetails
    const [totalSpent, setTotalSpent] = useState<number>(0);
    const [user1Total, setUser1Total] = useState<number>(0);
    const [user2Total, setUser2Total] = useState<number>(0);
    const [whoIsOwed, setWhoIsOwed] = useState<string>('');
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    useEffect(() => {

        const calculateTotals = () => {

            const user1Sum = listItems.reduce((sum, item) => sum + roundToDecimals(item.user1Spent), 0);
            const user2Sum = listItems.reduce((sum, item) => sum + roundToDecimals(item.user2Spent), 0);

            const totalSpent = user1Sum + user2Sum;
            const equalShare = totalSpent / 2;
            const user1Owes = roundToDecimals(equalShare - user1Sum);
            const user2Owes = roundToDecimals(equalShare - user2Sum);

            let whoIsOwedSum;
            if (user1Owes > 0) {
                whoIsOwedSum = `${user1Name} owes ${user2Name} <span>£${formatNumber(user1Owes)}</span>`;
            } else if (user2Owes > 0) {
                whoIsOwedSum = `${user2Name} owes ${user1Name} <span>£${formatNumber(user2Owes)}</span>`;
            } else {
                whoIsOwedSum = `Both have paid equally.`;
            }

            setUser1Total(user1Sum);
            setUser2Total(user2Sum);
            setTotalSpent(totalSpent);
            setWhoIsOwed(whoIsOwedSum);
        };
        calculateTotals();

    }, [listItems, user1Name, user2Name]);

    const handleOpenArchiveModal = () => {
        setModalOpen(true);
    }

    const handleCancelDelete = () => {
        setModalOpen(false);
    }

    const handleConfirmDelete = async () => {
        await updateDoc(doc(db, "expensesLists", listDetails.id), { archived: true });
        setModalOpen(false);
    }

    return (
        <>

            {modalOpen &&
                <Modal>
                    <div className="flex items-center justify-center bg-green-100 rounded-full h-12 w-12 fill-green-600 mb-4">
                        <svg height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.888 19.744c-1.229.588-1.88.732-3.018.732-2.735 0-4.233-2.064-7.453-.977.489-.641 2.698-3 2.431-6.5H16v-1.988h-4.559c-.708-2.295-1.913-4.278-.517-6.471 1.441-2.263 4.976-1.733 5.967 1.484l3.561-.521C19.798 1.453 16.383 0 13.568 0 9.04 0 4.502 3.621 6.595 11.012H4V13h3.068c.692 3.823-.458 5.797-2.958 7.901L5.906 24c4.771-2.849 7.205 0 11.499 0 1.296-.008 2.394-.309 3.595-.994l-1.112-3.262z" /></svg>
                    </div>
                    <h3 className="font-bold text-xl md:text-2xl mb-4">Mark as Paid</h3>
                    <p className="text-body-color max-w-96 mx-auto">Please confirm you want to mark this expenses sheet as paid and archive the list.</p>
                    <div className="grid md:grid-flow-col gap-4 mt-6">
                        <button className="max-md:order-2 border-2 cursor-pointer rounded-md font-bold transition hover:bg-opacity-90 px-8 py-3 hover:bg-dark hover:text-white text-body-color" onClick={handleCancelDelete}>Cancel</button>
                        <button className="max-md:order-1 bg-green-600 text-white cursor-pointer rounded-md font-bold transition hover:bg-opacity-90 px-8 py-3 hover:bg-green-700" onClick={handleConfirmDelete}>Confirm Paid</button>
                    </div>
                </Modal>
            }

            <h2 className="border-b-2 font-bold text-xl mb-5 pb-5">Summary</h2>
            <p className="flex font-medium text-body-color justify-between text-lg mb-3">{user1Name} spent <span>£{formatNumber(user1Total)}</span></p>
            <p className="flex font-medium text-body-color justify-between text-lg mb-6">{user2Name} spent <span>£{formatNumber(user2Total)}</span></p>
            <p className="flex font-bold text-dark justify-between text-lg mb-3">Total<span>£{formatNumber(totalSpent)}</span></p>
            <p className="border-t-2 flex font-bold text-dark justify-between text-lg mt-6 pt-6" dangerouslySetInnerHTML={{ __html: whoIsOwed }} />
            {!archived &&
                <Button className="mt-7" fullWidth onClick={handleOpenArchiveModal}>Mark as paid</Button>
            }
        </>
    )
}

export default ExpensesSummary;
