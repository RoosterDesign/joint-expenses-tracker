import { collection, addDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Button from '@/components/Button';

const Signin: React.FC = () => {
    const today = new Date();
    const listTitle = today.toLocaleString('en-GB', { year: 'numeric', month: 'short' });
    const newList = {
        listTitle: listTitle,
        user1Name: "Neil",
        user2Name: "Lou"
    };

    // Create New Expenses List
    const createExpensesList = async (e: React.MouseEvent) => {
        e.preventDefault();
        await addDoc(collection(db, "expensesLists"), {
            title: newList.listTitle,
            user1Name: newList.user1Name,
            user2Name: newList.user2Name,
            archived: false
        });
    };

    return (
        <div className="container flex flex-1">

            <Button className="mx-auto inline-flex items-center self-center -mt-28" onClick={createExpensesList} large>
                <svg className="mr-3" width={20} height={20} xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 20 20"><path d="M13.188 9.281h-2.5V6.812a.7.7 0 0 0-.72-.687.7.7 0 0 0-.687.719v2.468H6.812a.7.7 0 0 0-.687.72.7.7 0 0 0 .719.687h2.468v2.469a.7.7 0 0 0 .72.687.7.7 0 0 0 .687-.719v-2.469h2.469a.7.7 0 0 0 .687-.718.694.694 0 0 0-.688-.688Z" /><path d="M10 .563A9.43 9.43 0 0 0 .562 10c0 5.219 4.25 9.469 9.47 9.469 5.218 0 9.468-4.25 9.468-9.469C19.469 4.781 15.219.562 10 .562Zm0 17.5c-4.438 0-8.031-3.625-8.031-8.063A8.029 8.029 0 0 1 10 1.969c4.438 0 8.063 3.593 8.063 8.031 0 4.438-3.625 8.063-8.063 8.063Z" /></svg>
                Create New Expenses List
            </Button>


            {/* <div className="relative self-center w-full max-w-[525px] mx-auto rounded-lg bg-white -mt-20 px-10 py-16 text-center sm:px-12 md:px-[60px] shadow-4">



               <div className="mb-12 text-center font-bold text-2xl">
                    Create New Expenses Sheet
                </div>

                <form onSubmit={createExpensesList} className="text-left">

                    <div className="mb-8">
                        <label htmlFor="listName" className="block mb-2 font-medium text-body-color text-sm">Enter a name for this list</label>
                        <input
                            type="text"
                            placeholder="List name"
                            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none focus:border-primary focus-visible:shadow-none"
                            value={newList.listTitle}
                            id="listName"
                            onChange={(e) => setNewList({ ...newList, listTitle: e.target.value })}
                        />
                    </div>

                    <div className="mb-8 grid grid-cols-2 gap-6">

                        <div>
                            <label htmlFor="user1Name" className="block mb-2 font-medium text-body-color text-sm">User 1 name</label>
                            <input
                                type="text"
                                placeholder="User 1 name"
                                className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none focus:border-primary focus-visible:shadow-none"
                                value={newList.user1Name}
                                id="user1Name"
                                onChange={(e) => setNewList({ ...newList, user1Name: e.target.value })}
                            />
                        </div>

                        <div >
                            <label htmlFor="user2Name" className="block mb-2 font-medium text-body-color text-sm">User 2 name</label>
                            <input
                                type="text"
                                placeholder="User 2 name"
                                className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none focus:border-primary focus-visible:shadow-none"
                                value={newList.user2Name}
                                id="user2Name"
                                onChange={(e) => setNewList({ ...newList, user2Name: e.target.value })}
                            />
                        </div>

                    </div>

                    <button className="w-full cursor-pointer rounded-md border bg-primary px-5 py-4 text-base font-medium text-white transition hover:bg-opacity-90">Create New Expenses List</button>

                </form>

            </div>*/}
        </div>
    );
};

export default Signin;
