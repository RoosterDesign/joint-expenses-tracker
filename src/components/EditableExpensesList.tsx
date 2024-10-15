'use client';

import { useState } from 'react';
import { deleteExpense, updateExpense } from '@/utils/expensesServices';
import { formatNumber } from '@/utils/utils';
import { ExpensesList, ExpensesItem } from '@/app/types';
import SavingSpinner from '@/components/SavingSpinner';
import DatePicker from '@/components/DatePicker';
import Modal from '@/components/Modal';

interface Props {
    listDetails?: ExpensesList;
    listItems: ExpensesItem[];
}

interface Errors {
    name?: string;
    user1Spent?: string;
    user2Spent?: string;
    numbers?: string;
}

const EditableExpensesList: React.FC<Props> = ({ listDetails, listItems }) => {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
    const [editedItem, setEditedItem] = useState<ExpensesItem | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // Form validation
    const validateForm = (): Errors => {

        const validationErrors: Errors = {};

        // Check if name is empty
        if (!editedItem?.name.trim()) {
            validationErrors.name = "Expense name is required";
        }

        // Check if number1 or number2 are 0, and both are empty or 0
        if (!editedItem?.user1Spent && !editedItem?.user2Spent || (editedItem.user1Spent === 0 || !editedItem.user1Spent) && editedItem.user2Spent === 0 || (editedItem.user2Spent === 0 || !editedItem.user2Spent) && editedItem.user1Spent === 0) {
            validationErrors.user1Spent = "At least one amount must be entered (above zero!)";
        };

        return validationErrors;
    };

    const handleOnEdit = (item: ExpensesItem) => {
        setEditingItemId(item.id);
        setEditedItem(item);
    };

    const handleDateValueChange = (newValue: string) => {
        const dateObj: string[] = newValue.split('/');
        const day = parseInt(dateObj[0], 10);
        const month = parseInt(dateObj[1], 10) - 1;
        const year = parseInt(dateObj[2], 10);
        const newDate: string = new Date(year, month, day).toISOString();
        setEditedItem((prevItem) => ({
            ...prevItem,
            date: newDate,
            id: prevItem?.id || '', // Ensure id is a string
            name: prevItem?.name || '', // Ensure name is a string
            user1Spent: prevItem?.user1Spent ?? 0, // Ensure user1Spent is a number
            user2Spent: prevItem?.user2Spent ?? 0, // Ensure user2Spent is a number
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setEditedItem({
            ...editedItem,
            [name]: type === 'number' ? Number(value) : value
        } as ExpensesItem);
    };

    const handleSave = async () => {
        if (listDetails && editedItem) {
            setIsUpdating(true);
            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setIsUpdating(false);
            } else {
                await updateExpense(listDetails.id, editedItem);
                setErrors({});
                setEditingItemId(null);
                setEditedItem(null);
                setIsUpdating(false);
            }

        }
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditedItem(null);
    };

    const handleOpenDeleteModal = (itemId: string) => {
        setDeletingItemId(itemId);
        setModalOpen(true);
    }

    const handleCancelDelete = () => {
        setModalOpen(false);
        setDeletingItemId(null);
    }

    const handleConfirmDelete = async () => {
        if (!listDetails || !deletingItemId) return;
        await deleteExpense(listDetails?.id, deletingItemId);
        setDeletingItemId(null);
        setModalOpen(false);
    }

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-gb');
    }

    if (!listDetails) return;

    return (
        <>

            {modalOpen &&
                <Modal>
                    <div className="flex items-center justify-center bg-red-100 rounded-full h-12 w-12 fill-red-600 mb-4">
                        <svg height="25" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.095 19.886 9.248-16.5a.753.753 0 0 1 1.313 0l9.248 16.5a.75.75 0 0 1-.656 1.116H2.752a.75.75 0 0 1-.657-1.116zm1.935-.384h15.939l-7.97-14.219zm7.972-6.497a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75zm-.002-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fillRule="nonzero" /></svg>
                    </div>
                    <h3 className="font-bold text-xl md:text-2xl mb-4">Delete this Expense</h3>
                    <p className="text-body-color">Please confirm you want to delete this expense.</p>
                    <div className="grid md:grid-flow-col gap-4 mt-6">
                        <button className="max-md:order-2 border-2 cursor-pointer rounded-md font-bold transition hover:bg-opacity-90 px-8 py-3 hover:bg-dark hover:text-white text-body-color" onClick={handleCancelDelete}>Cancel</button>
                        <button className="max-md:order-1 bg-red-600 text-white cursor-pointer rounded-md font-bold transition hover:bg-opacity-90 px-8 py-3 hover:bg-red-700" onClick={handleConfirmDelete}>Confirm Delete</button>
                    </div>
                </Modal>
            }

            <div className="w-full 2xl:text-base">

                <div className="flex flex-col">

                    <div className="max-lg:hidden expenseTableRow rounded-md font-bold border-b-0 mb-2 bg-emerald-600 text-white">
                        <div className="">Date</div>
                        <div className="">Expense name</div>
                        <div className="text-center">{listDetails?.user1Name} Paid</div>
                        <div className="text-center">{listDetails?.user2Name} Paid</div>
                    </div>

                    {listItems.length === 0 && <p className="text-center font-bold mt-5">Please enter your first expense.</p>}

                    {listItems.map(item => {
                        return (

                            <div key={item.id} className="expenseTableRow" >

                                {editingItemId === item.id ? (

                                    <>

                                        {isUpdating && <SavingSpinner label="Saving" />}

                                        <div className="max-lg:mb-3">
                                            <label htmlFor="name" className="block font-bold mb-2 text-body-color lg:hidden">Date</label>
                                            <div className="h-12">
                                                <DatePicker onValueChange={handleDateValueChange} defaultDate={formattedDate(editedItem!.date)} />
                                            </div>
                                        </div>

                                        <div className="max-lg:mb-3">
                                            <label htmlFor="name" className="block font-bold mb-2 text-body-color lg:hidden">Expense name</label>
                                            <input
                                                type="text"
                                                placeholder="Expense name"
                                                className="w-full h-12 bg-transparent rounded-md border border-stroke py-[10px] px-5 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
                                                name="name"
                                                value={editedItem?.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="max-lg:mb-3">
                                            <label htmlFor="name" className="block font-bold mb-2 text-body-color lg:hidden">{listDetails.user1Name} Spent</label>
                                            <div className="flex items-center h-12">

                                                <span className='h-full rounded-tl-md rounded-bl-md border border-r-0 py-[10px] px-3 text-base font-bold uppercase text-white border-emerald-600 bg-emerald-600'>£</span>

                                                <input
                                                    type="number"
                                                    step="any"
                                                    min="0"
                                                    className="w-full h-full bg-transparent rounded-br-md rounded-tr-md border border-stroke py-[10px] px-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 lg:rounded xl:rounded-bl-none xl:rounded-tl-none"
                                                    name="user1Spent"
                                                    value={editedItem?.user1Spent}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="max-lg:mb-4">
                                            <label htmlFor="name" className="block font-bold mb-2 text-body-color lg:hidden">{listDetails.user2Name} Spent</label>
                                            <div className="flex items-center h-12">
                                                <span className='h-full rounded-tl-md rounded-bl-md border border-r-0 py-[10px] px-3 text-base font-bold uppercase text-white border-emerald-600 bg-emerald-600'>£</span>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    min="0"
                                                    className="w-full h-full bg-transparent rounded-br-md rounded-tr-md border border-stroke py-[10px] px-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 lg:rounded xl:rounded-bl-none xl:rounded-tl-none"
                                                    name="user2Spent"
                                                    value={editedItem?.user2Spent}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center text-center gap-3">
                                            <button onClick={handleSave} className="tableActionButton fill-white bg-green-600 hover:bg-green-700 max-lg:h-[40px] max-lg:w-[100px] h-12 w-12">
                                                <svg height="20" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.25 12.321 7.27 6.491a.749.749 0 0 0 1.058-.059l11.23-12.501a.748.748 0 1 0-1.116-1.001L9.961 17.196 3.25 11.202a.748.748 0 1 0-1 1.119" fillRule="nonzero" /></svg>
                                            </button>
                                            <button onClick={handleCancelEdit} className="tableActionButton fill-body-color bg-slate-200 hover:bg-slate-300 max-lg:h-[40px] max-lg:w-[100px] h-12 w-12">
                                                <svg height="20" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 10.93 5.719-5.72a.749.749 0 1 1 1.062 1.062l-5.72 5.719 5.719 5.719a.75.75 0 1 1-1.061 1.062L12 13.053l-5.719 5.719A.75.75 0 0 1 5.22 17.71l5.719-5.719-5.72-5.719A.752.752 0 0 1 6.281 5.21z" /></svg>
                                            </button>
                                        </div>

                                        {
                                            Object.keys(errors).length > 0 &&
                                            <div className="flex flex-col w-full rounded-lg border-l-[6px] border-red bg-red-light-6 px-5 py-5 mt-2 mb-4 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.08)] col-span-5">
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

                                    </>

                                ) : (
                                    <>
                                        <div className="">
                                            {formattedDate(item.date)}
                                        </div>

                                        <div className="font-bold max-lg:mb-2 max-lg:col-span-2">
                                            {item.name}
                                        </div>

                                        <div className="max-lg:col-span-2 lg:text-center">
                                            <span className="lg:hidden mr-3 font-bold text-body-color">{listDetails.user1Name} Spent</span>
                                            {item.user1Spent === 0 ? '-' : `£${formatNumber(item.user1Spent)}`}
                                        </div>

                                        <div className="max-lg:col-span-2 lg:text-center">
                                            <span className="lg:hidden mr-3 font-bold text-body-color">{listDetails.user2Name} Spent</span>
                                            {item.user2Spent === 0 ? '-' : `£${formatNumber(item.user2Spent)}`}
                                        </div>

                                        <div className="max-lg:col-start-2 max-lg:col-end-3 max-lg:row-start-1 text-center flex justify-end gap-3">
                                            <button onClick={() => handleOnEdit(item)} className="tableActionButton fill-body-color bg-slate-200 hover:bg-slate-300">
                                                <svg height="18" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 20.25a.772.772 0 0 0-.75-.75H3.75c-.394 0-.75.348-.75.75s.356.75.75.75h14.5c.394 0 .75-.348.75-.75zM6.977 13.167c-1.334 3.916-1.48 4.232-1.48 4.587 0 .527.46.749.749.749.352 0 .668-.137 4.574-1.493zm1.06-1.061 3.846 3.846 8.824-8.814a.997.997 0 0 0 0-1.413l-2.435-2.432a.997.997 0 0 0-1.413 0z" fillRule="nonzero" /></svg>
                                            </button>
                                            <button onClick={() => handleOpenDeleteModal(item.id)} className="tableActionButton fill-white bg-red-600 hover:bg-red-700">
                                                <svg height="15" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24"><path d="M19 24H5a2 2 0 0 1-2-2V6h18v16a2 2 0 0 1-2 2m-9-14a1 1 0 0 0-2 0v9a1 1 0 0 0 2 0v-9zm6 0a1 1 0 0 0-2 0v9a1 1 0 0 0 2 0v-9zm6-5H2V3h6V1.5C8 .673 8.673 0 9.5 0h5c.825 0 1.5.671 1.5 1.5V3h6v2zM10 3h4V2h-4v1z" /></svg>
                                            </button>
                                        </div>
                                    </>

                                )}

                            </div>



                        )
                    })}

                </div>

            </div >

        </>
    )

}

export default EditableExpensesList;
