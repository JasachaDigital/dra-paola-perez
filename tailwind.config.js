/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./*.html', './js/**/*.js'],
    theme: {
        extend: {
            colors: {
                accent: '#B8860B',
                'accent-light': '#D4A843',
                'accent-dark': '#8B6508',
                cream: '#FFFDF7',
                'warm-gray': '#F7F5F0',
            },
            fontFamily: {
                serif: ['Playfair Display', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        }
    }
};
