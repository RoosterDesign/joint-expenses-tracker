interface Props {
    children: React.ReactNode;
    overflow?: boolean;
    className?: string;
}

const Card: React.FC<Props> = ({ children, overflow, className = '' }) => {
    return (
        <div className={`bg-[#141b18] border border-white/[0.07] rounded-[22px] p-6 2xl:p-8 ${overflow ? 'overflow-x-auto' : ''} ${className}`}>
            {children}
        </div>
    );
}

export default Card;
