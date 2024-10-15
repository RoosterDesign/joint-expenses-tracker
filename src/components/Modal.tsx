interface Props {
    children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ children }) => {
    return (
        <div className="bg-opacity-80 items-center justify-center flex fixed inset-0 z-10 bg-dark p-4">
            <div className="items-center justify-center flex flex-col w-full max-w-[570px] rounded-[20px] bg-white px-8 py-12 text-center">
                {children}
            </div>
        </div>
    )
}

export default Modal;
