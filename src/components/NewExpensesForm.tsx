'use client';

import { useState } from 'react';
import { addExpense } from '@/utils/expensesServices';
import { ExpensesList, ExpensesFormData, ExpensesItem } from '@/app/types';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import SavingSpinner from '@/components/SavingSpinner';

interface Props {
    listDetails: ExpensesList;
}

interface Errors {
    name?: string;
    user1Spent?: string;
    user2Spent?: string;
    numbers?: string;
}

const NewExpensesForm: React.FC<Props> = ({ listDetails }) => {
    const NEW_ITEM_DEFAULT = { date: new Date().toLocaleDateString('en-gb'), name: '', user1Spent: '', user2Spent: '' };
    const [newItem, setNewItem] = useState<ExpensesFormData>(NEW_ITEM_DEFAULT);
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleDateValueChange = (newValue: string) => {
        setNewItem({ ...newItem, date: newValue })
    };

    // Form validation
    const validateForm = (): Errors => {
        const validationErrors: Errors = {};

        // Check if name is empty
        if (!newItem.name.trim()) {
            validationErrors.name = "Expense name is required";
        }

        // Check if number1 or number2 are 0, and both are empty or 0
        if (!newItem.user1Spent && !newItem.user2Spent || (parseInt(newItem.user1Spent) === 0 || !newItem.user1Spent) && parseInt(newItem.user2Spent) === 0 || (parseInt(newItem.user2Spent) === 0 || !newItem.user2Spent) && parseInt(newItem.user1Spent) === 0) {
            validationErrors.user1Spent = "At least one amount must be entered (above zero!)";
        };

        return validationErrors;
    };


    // Add item to database
    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
        } else {
            setErrors({});

            // Submit the form or process data
            const dateObj: string[] = newItem.date.split('/');
            const day = parseInt(dateObj[0], 10);
            const month = parseInt(dateObj[1], 10) - 1;
            const year = parseInt(dateObj[2], 10);
            const newDate: string = new Date(year, month, day).toISOString();
            const newExpense: Omit<ExpensesItem, 'id'> = {
                date: newDate,
                name: newItem.name.trim(),
                user1Spent: newItem.user1Spent ? parseFloat(newItem.user1Spent) : 0,
                user2Spent: newItem.user2Spent ? parseFloat(newItem.user2Spent) : 0
            }
            await addExpense(listDetails.id, newExpense);
            setNewItem(NEW_ITEM_DEFAULT);
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleAddExpense} className="relative">

            <h2 className="border-b-2 font-bold text-xl mb-5 pb-5">Add new expense</h2>

            {isSubmitting && <SavingSpinner label="Saving" />}

            <div className="grid gap-x-4 gap-y-8 items-center">

                <div className="h-12 mb-6 col-span-2">
                    <label htmlFor="name" className="block font-bold mb-2 text-body-color">Date</label>
                    <DatePicker onValueChange={handleDateValueChange} defaultDate={newItem.date} sidebar />
                </div>

                <div className="h-12 mb-6 col-span-2">
                    <label htmlFor="name" className="block font-bold mb-2 text-body-color">Expense name</label>
                    <input
                        type="text"
                        placeholder="Expense name"
                        className="w-full h-full bg-transparent rounded-md border border-stroke py-[10px] px-5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                        value={newItem.name}
                        id="name"
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                </div>


                <div className="h-12 mb-6 col-start-1 col-end-2 lg:col-span-2 xl:col-span-1">
                    <label htmlFor="name" className="block font-bold mb-2 text-body-color">{listDetails.user1Name} Spent</label>
                    <div className='flex items-center h-full'>
                        <span className='h-full rounded-tl-md rounded-bl-md border border-r-0 py-[10px] px-3 text-base font-bold uppercase text-white border-emerald-600 bg-emerald-600'>£</span>
                        <input
                            type="number"
                            step="any"
                            min="0"
                            value={newItem.user1Spent}
                            onChange={(e) => setNewItem({ ...newItem, user1Spent: e.target.value })}
                            className='w-full h-full bg-transparent rounded-br-md rounded-tr-md border border-stroke  py-[10px] px-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                        />
                    </div>
                </div>

                <div className="h-12 mb-6 col-start-2 col-end-3 lg:col-span-2 xl:col-span-1">
                    <label htmlFor="name" className="block font-bold mb-2 text-body-color">{listDetails.user2Name} Spent</label>
                    <div className='flex items-center h-full'>
                        <span className='h-full rounded-tl-md rounded-bl-md border border-r-0 py-[10px] px-3 text-base font-bold uppercase text-white border-emerald-600 bg-emerald-600'>£</span>
                        <input
                            type="number"
                            step="any"
                            min="0"
                            value={newItem.user2Spent}
                            onChange={(e) => setNewItem({ ...newItem, user2Spent: e.target.value })}
                            className='w-full h-full bg-transparent rounded-br-md rounded-tr-md border border-stroke py-[10px] px-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                        />
                    </div>
                </div>

                <div className="text-center flex justify-end col-span-2">
                    <Button className="w-full text-base px-0 py-0" type="submit">Add new expense</Button>
                </div>

            </div>

            {
                Object.keys(errors).length > 0 &&
                <div className="flex flex-col w-full rounded-lg border-l-[6px] border-red bg-red-light-6 px-5 py-5 mt-8 mb-4 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)]">
                    <h5 className="text-base font-semibold text-red-600 mb-3">
                        There {Object.keys(errors).length === 1 ? 'is' : 'are'} {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'error' : 'errors'}!
                    </h5>

                    <ul className="list-inside list-disc">
                        {errors.numbers &&
                            <li className="text-base leading-relaxed text-red-light">
                                {errors.numbers}
                            </li>
                        }
                        {errors.name &&
                            <li className="text-base leading-relaxed text-red-light">
                                {errors.name}
                            </li>
                        }
                        {errors.user1Spent &&
                            <li className="text-base leading-relaxed text-red-light">
                                {errors.user1Spent}
                            </li>
                        }
                        {errors.user2Spent &&
                            <li className="text-base leading-relaxed text-red-light">
                                {errors.user2Spent}
                            </li>
                        }
                    </ul>
                </div>
            }

        </form >
    )
};

export default NewExpensesForm;
