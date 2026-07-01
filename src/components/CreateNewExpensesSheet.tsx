import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Button from '@/components/Button';

const CreateNewExpensesSheet: React.FC = () => {
    const today = new Date();
    const listTitle = today.toLocaleString('en-GB', { year: 'numeric', month: 'short' });

    const createExpensesList = async (e: React.MouseEvent) => {
        e.preventDefault();
        await addDoc(collection(db, "expensesLists"), {
            title: listTitle,
            user1Name: "Neil",
            user2Name: "Lou",
            archived: false
        });
    };

    return (
        <div className="container flex flex-1 items-center justify-center">
            <div className="text-center">
                <p className="mb-6 text-[15px] text-[#8a978f]">No active expenses list. Start a new month.</p>
                <Button onClick={createExpensesList} large>
                    Start {listTitle}
                </Button>
            </div>
        </div>
    );
};

export default CreateNewExpensesSheet;
