import api from './axios'

export const getKakaoLoginUrl = () => api.get('/auth/kakao')
export const getMe = () => api.get('/auth/me')

// 개발용 테스트 로그인
export const testLogin = (userId) => api.get(`/auth/test-login/${userId}`)
