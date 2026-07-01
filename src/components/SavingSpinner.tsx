interface Props {
    label: string;
}

const SavingSpinner: React.FC<Props> = ({ label }) => {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 rounded-[22px] bg-[#141b18]/90 text-[14px] font-semibold text-[#8a978f]">
            <svg width="22" height="22" className="animate-spin" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                <mask id="a" fill="#fff">
                    <path d="M18.474 13.035c.52.186 1.096-.083 1.23-.619A10 10 0 0 0 11.186.071c-.548-.066-1.005.378-1.015.93-.01.552.43 1 .976 1.08a8.001 8.001 0 0 1 6.663 9.658c-.12.539.144 1.11.664 1.296Z" />
                </mask>
                <path d="M18.474 13.035c.52.186 1.096-.083 1.23-.619A10 10 0 0 0 11.186.071c-.548-.066-1.005.378-1.015.93-.01.552.43 1 .976 1.08a8.001 8.001 0 0 1 6.663 9.658c-.12.539.144 1.11.664 1.296Z" stroke="#34d399" strokeWidth="4" mask="url(#a)" />
            </svg>
            {label}...
        </div>
    );
}

export default SavingSpinner;
