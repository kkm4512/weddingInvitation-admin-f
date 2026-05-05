import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// 카카오 OAuth 콜백: 서버가 리다이렉트할 때 URL에 token 파라미터를 포함시키는 방식
// 서버 구현에 따라 조정 필요
export default function KakaoCallbackPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const token = params.get('accessToken')
    const userId = params.get('userId')
    if (token && userId) {
      setAuth(userId, token)
      navigate('/', { replace: true })
    } else {
      // 서버가 JSON으로 반환하는 경우 — 서버 응답 방식에 맞게 수정
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f4]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#8b6f5e] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">로그인 처리 중...</p>
      </div>
    </div>
  )
}
