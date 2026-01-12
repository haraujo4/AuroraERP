/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    main: '#F5F6F8',
                    panel: '#FFFFFF',
                    sidebar: '#E9EDF2',
                },
                border: {
                    default: '#D0D7E2',
                },
                text: {
                    primary: '#1F2937',
                    secondary: '#4B5563',
                    muted: '#6B7280',
                },
                brand: {
                    primary: '#2563EB',
                    secondary: '#3B82F6',
                },
                status: {
                    success: '#16A34A',
                    warning: '#D97706',
                    danger: '#DC2626',
                    info: '#3B82F6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                xs: '12px',
                sm: '13px',
                base: '14px',
                lg: '16px',
                xl: '18px',
            },
            spacing: {
                'base': '4px',
            }
        },
    },
    plugins: [],
}
