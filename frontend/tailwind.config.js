/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 브랜드 포인트 컬러 (와이어프레임 인디고)
        brand: '#5B5BD6',
      },
    },
  },
  plugins: [],
}
