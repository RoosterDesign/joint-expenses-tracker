/*
 * Brand mark — "cut-out swirl" yin-yang (design 8a). Purple #a78bfa + coral #fb7185,
 * with the two dots punched clean through as transparent holes (SVG mask), so the mark
 * drops onto any background and the holes always show whatever is behind it.
 */
import { useId } from 'react';

export default function Logo({ className }: { className?: string }) {
    const id = useId();
    return (
        <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Joint Expenses">
            <mask id={id} maskUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="#fff" />
                <circle cx="50" cy="30" r="6.5" fill="#000" />
                <circle cx="50" cy="70" r="6.5" fill="#000" />
            </mask>
            <g mask={`url(#${id})`}>
                <path d="M50 10a40 40 0 0 1 0 80 20 20 0 0 1 0-40 20 20 0 0 0 0-40z" fill="#a78bfa" />
                <path d="M50 90a40 40 0 0 1 0-80 20 20 0 0 1 0 40 20 20 0 0 0 0 40z" fill="#fb7185" />
            </g>
        </svg>
    );
}
