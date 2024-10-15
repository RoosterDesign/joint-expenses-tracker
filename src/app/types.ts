export interface ExpensesFormData {
    date: string;
    name: string;
    user1Spent: string;
    user2Spent: string;
}

export interface ExpensesItem {
    id: string;
    date: string;
    name: string;
    user1Spent: number;
    user2Spent: number;
}

export interface ExpensesList {
    id: string;
    title: string;
    user1Name: string;
    user2Name: string;
    archived: boolean;
    items?: ExpensesItem[];
}
