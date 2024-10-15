interface Props {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    small?: boolean;
    large?: boolean;
    fullWidth?: boolean;
    secondary?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<Props> = ({ children, onClick, type = 'button', className = '', small, large, fullWidth, secondary }) => {

    return (
        <button
            className={`border-0 cursor-pointer rounded-md font-bold transition hover:bg-opacity-90 px-8 py-3 text-white
            ${small ? 'text-base' : 'text-lg'}
            ${large ? 'px-10 py-5' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${secondary ? 'bg-dark' : 'bg-primary'}
            ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button >
    )
}

export default Button;
