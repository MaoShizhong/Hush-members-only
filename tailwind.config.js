/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./views/*.pug'],
    theme: {
        extend: {
            backgroundImage: {
                hush: 'url("/hush.svg")',
                angry: 'url("/angry.svg")',
            },
            fontFamily: {
                jost: ['Jost', 'sans-serif', 'system-ui'],
            },
        },
    },
    plugins: [],
};
