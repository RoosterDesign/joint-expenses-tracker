import { db } from "@/utils/firebase";
import { collection, query, doc, getDoc, addDoc, getDocs, deleteDoc, updateDoc, ref, onSnapshot, DocumentSnapshot } from "firebase/firestore";
import { ExpensesItem, ExpensesList } from "@/app/types";


// Subscribe to real-time updates of a specific todo list by its ID
/*
export const subscribeToExpensesList = (id: string, callback: (todoList: ExpensesList | null) => void): () => void => {
    const listRef = doc(db, `expensesLists/${id}`);

    const unsubscribeList = onSnapshot(listRef, async (snapshot: DocumentSnapshot) => {
        const data = snapshot.data();
        if (data) {
            const items: ExpensesItem[] = [];

            console.log('items service', items);

            const itemsCollection = collection(db, `expensesLists/${id}/items`);

            // Subscribe to changes in the sub-collection
            const unsubscribeItems = onSnapshot(itemsCollection, (itemsSnapshot) => {
                itemsSnapshot.forEach((itemDoc) => {
                    const itemData = itemDoc.data();
                    items.push({
                        id: itemDoc.id,
                        date: itemData.date,
                        name: itemData.name,
                        user1Spent: itemData.user1Spent,
                        user2Spent: itemData.user2Spent,
                    });
                });

                // Once we have the items, call the callback
                callback({
                    id,
                    title: data.title,
                    user1Name: data.user1Name,
                    user2Name: data.user2Name,
                    archived: data.archived,
                    items,
                });
            });

            // Call the callback for the main document
            callback({
                id,
                title: data.title,
                user1Name: data.user1Name,
                user2Name: data.user2Name,
                archived: data.archived,
                items,
            });

            // Return unsubscribe function for the sub-collection
            return unsubscribeItems;
        } else {
            callback(null);
        }
    });

    // Return unsubscribe function for the main document
    return () => {
        unsubscribeList(); // Unsubscribe from the main document listener
    };
};
*/

// Fetches a single expense list by its ID, including items from the sub-collection

export const getExpensesListById = async (id: string): Promise<ExpensesList | null> => {

    const docRef = doc(db, "expensesLists", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    const items: ExpensesItem[] = [];

    // Fetch items from the sub-collection
    const itemsQuery = query(collection(docRef, 'items'));
    const itemsSnapshot = await getDocs(itemsQuery);

    itemsSnapshot.forEach((itemDoc) => {
        const itemData = itemDoc.data();
        items.push({
            id: itemDoc.id,
            date: itemData.date,
            name: itemData.name,
            user1Spent: itemData.user1Spent,
            user2Spent: itemData.user2Spent,
        });
    });

    return {
        id: docSnap.id,
        title: data.title,
        user1Name: data.user1Name,
        user2Name: data.user2Name,
        archived: data.archived,
        items,
    };
};


/*export const getExpensesListById = async (id: string): Promise<ExpensesList | null> => {
    try {
        const docRef = doc(db, "expensesLists", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as ExpensesList;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting task:", error);
        throw error;
    }
};*/


// Get all expenses list items

export const getExpensesListItems = async (id: string): Promise<ExpensesItem[]> => {
    try {
        const q = query(collection(db, "expensesLists", id, "items"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ExpensesItem);
    } catch (error) {
        console.error("Error getting user tasks:", error);
        throw error;
    }
};


// Add expense to database

export const addExpense = async (listId: string, expense: Omit<ExpensesItem, 'id'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, "expensesLists", listId, "items"), expense);
        return docRef.id;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}


// Delete expense from database

export const deleteExpense = async (listId: string, itemId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "expensesLists", listId, "items", itemId));
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}


// Update an expense

// export const updateExpense = async (listId: string, itemId: string, updatedExpense: Partial<ExpensesItem>) => {
export const updateExpense = async (listId: string, updatedExpense: ExpensesItem) => {
    try {
        console.info('updatedExpense', updatedExpense.id, updatedExpense);
        await updateDoc(doc(db, "expensesLists", listId, "items", updatedExpense.id), updatedExpense);
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}



// export const updateExpense = async (listId: string, updatedExpense: ExpensesItem) => {
//     const itemDocRef = doc(db, "expensesLists", listId, "items", updatedExpense.id);

//     try {
//         await updateDoc((itemDocRef), updatedExpense);
//     } catch (error) {
//         console.error("Error updating task:", error);
//         throw error;
//     }
// }
