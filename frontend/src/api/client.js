import axios from 'axios'

// 백엔드 API 클라이언트 (vite proxy로 /api → :8000)
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})
