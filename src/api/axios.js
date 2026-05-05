import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

// 요청 인터셉터 — JWT 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터 — 401 시 로그인 페이지로
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userId')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
