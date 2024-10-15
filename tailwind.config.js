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
            'primary': '#059669'
        },
    },
  },
  plugins: [tailgrids],
}
