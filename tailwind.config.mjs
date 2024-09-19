/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				primary: {
					light: '#6401ff',
					normal: '#5400d8',
					dark: '#4602b0',
				},
			},
			fontFamily: {
				title: ['Roboto Mono', 'sans-serif'],
				body: ['Inria Sans', 'sans-serif'],
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
}
