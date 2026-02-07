import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 👇 THÊM ĐOẠN NÀY: Ép buộc dùng chung 1 phiên bản React
    dedupe: ['react', 'react-dom'], 
  },
})