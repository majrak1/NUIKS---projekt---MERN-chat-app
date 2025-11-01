/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                // matte gray scale: very neutral, no gradients
                matte: {
                    50: '#f5f5f6',
                    100: '#e6e6e6',
                    200: '#cfcfcf',
                    300: '#b8b8b8',
                    400: '#8f8f8f',
                    500: '#6e6e6e',
                    600: '#4f4f4f',
                    700: '#333333',
                    800: '#1f1f1f',
                    900: '#0b0b0b'
                }
            }
        }
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                matte: {
                    // use warm orange for primary/accent details
                    // primary: '#FF9913',
                    'primary-content': '#0b0b0b',

                    secondary: '#b8b8b8',
                    accent: '#FF9913',

                    neutral: '#0b0b0b',
                    'neutral-content': '#e6e6e6',

                    'base-100': '#0b0b0b',
                    'base-200': '#121212',
                    'base-300': '#242424',
                    'base-content': '#e6e6e6',

                    info: '#b8b8b8',
                    success: '#9e9e9e',
                    warning: '#b8b8b8',
                    error: '#999999'
                }
            }
        ],
        darkTheme: 'matte'
    }
}
