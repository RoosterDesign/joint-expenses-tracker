interface Props {
    children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ children }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-[500px] rounded-[22px] border border-white/[0.07] bg-[#141b18] px-8 py-10 text-center"
                 style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.28)' }}>
                {children}
            </div>
        </div>
    );
}

export default Modal;
