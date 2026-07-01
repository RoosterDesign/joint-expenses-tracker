interface Props {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    small?: boolean;
    large?: boolean;
    fullWidth?: boolean;
    secondary?: boolean;
    danger?: boolean;
    ghost?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<Props> = ({ children, onClick, type = 'button', className = '', small, large, fullWidth, secondary, danger, ghost }) => {
    let variant = 'bg-[#a78bfa] text-[#0d0818]';
    if (secondary) variant = 'bg-[#1a221e] text-[#eef2f0]';
    if (danger) variant = 'bg-[#fb7185] text-[#1a0509]';
    if (ghost) variant = 'border border-white/[0.12] text-[#c3ccc7] bg-transparent';

    return (
        <button
            className={`cursor-pointer rounded-full font-bold transition hover:opacity-90
            ${small ? 'text-[13px] px-5 py-2' : 'text-[14px] px-8 py-3'}
            ${large ? 'px-10 py-4 text-[16px]' : ''}
            ${fullWidth ? 'w-full' : ''}
            ${variant}
            ${className}`}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}

export default Button;
