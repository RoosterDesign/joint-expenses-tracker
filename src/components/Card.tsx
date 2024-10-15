interface Props {
    children: React.ReactNode;
    overflow?: boolean;
}

const Card: React.FC<Props> = ({ children, overflow }) => {
    return (
        <div className={`justify-start bg-white p-6 2xl:p-8 rounded-lg shadow-2 ${overflow ? 'overflow-x-auto' : ''}`}>
            {children}
        </div>
    )
}

export default Card;
