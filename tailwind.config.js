// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3B82F6', // Primary brand color (blue-500)
                    light: '#60A5FA',   // Lighter shade
                    dark: '#2563EB',    // Darker shade
                },
                secondary: {
                    DEFAULT: '#F97316', // Optional secondary brand color
                    light: '#FB923C',
                    dark: '#EA580C',
                },
                gray: colors.gray, // Keep Tailwind gray palette
            },
        },
    },
    plugins: [],
};
