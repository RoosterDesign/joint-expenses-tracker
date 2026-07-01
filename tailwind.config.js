/** @type {import('tailwindcss').Config} */

import * as tailgrids from 'tailgrids/plugin';

module.exports = {
  content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  theme: {
    extend: {
        container: {
            screens: {
                '3xl': '1440px',
            },
        },
        screens: {
            '3xl': '1920px',
        },
        colors: {
            'primary': '#059669',
            'neil': '#a78bfa',
            'lou': '#fb7185',
            'danger': '#fb7185',
            'surface': '#141b18',
            'surface-row': '#111815',
            'surface-input': '#0e1512',
            'surface-raised': '#1a221e',
            'app-bg': '#0c110f',
            'text-base': '#eef2f0',
            'text-dim': '#c3ccc7',
            'text-muted': '#8a978f',
            'text-faint': '#7c887f',
        },
        borderRadius: {
            'pill': '9999px',
        },
        fontFamily: {
            'num': ['var(--font-space-grotesk)', 'sans-serif'],
            'sans': ['var(--font-instrument-sans)', 'sans-serif'],
        },
    },
  },
  plugins: [tailgrids],
}
