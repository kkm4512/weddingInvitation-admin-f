import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getKakaoLoginUrl, testLogin } from '../api/auth'
import useAuthStore from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth, isLoggedIn } = useAuthStore()
  const [devId, setDevId] = useState('1')

  useEffect(() => {
    if (isLoggedIn()) navigate('/')
  }, [])

  const handleKakaoLogin = async () => {
    try {
      const res = await getKakaoLoginUrl()
      const url = typeof res.data.datas === 'string' ? res.data.datas : (res.data.datas?.url || res.data.datas?.loginUrl || res.data.datas?.redirectUrl || res.data.datas?.kakaoUrl)
      if (!url) throw new Error('No URL')
      window.location.href = url
    } catch {
      alert('카카오 로그인 URL을 불러오지 못했습니다.')
    }
  }

  const handleTestLogin = async () => {
    try {
      const res = await testLogin(devId)
      const { userId, accessToken } = res.data.datas
      setAuth(userId, accessToken)
      navigate('/')
    } catch {
      alert('테스트 로그인 실패. userId를 확인해주세요.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf8f4]">
      {/* 로고 */}
      <div className="mb-10 text-center">
        <div className="text-3xl font-light tracking-[0.15em] text-[#8b6f5e] mb-2">
          from today
        </div>
        <p className="text-sm text-gray-400">모바일 청첩장을 직접 만들어보세요</p>
      </div>

      {/* 카드 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <h2 className="text-lg font-medium text-center text-gray-700 mb-6">로그인</h2>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#F5DC00] text-[#3C1E1E] font-medium rounded-xl py-3.5 text-sm transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.38c0 2.07 1.35 3.9 3.39 4.95L4.14 15l3.39-2.25c.48.06.96.09 1.47.09 4.14 0 7.5-2.64 7.5-5.88S13.14 1.5 9 1.5z" fill="#3C1E1E"/>
          </svg>
          카카오로 로그인
        </button>

        {/* 구분선 */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="px-3 text-xs text-gray-300">개발용</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* 개발용 테스트 로그인 */}
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={devId}
            onChange={(e) => setDevId(e.target.value)}
            placeholder="userId"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]"
          />
          <button
            onClick={handleTestLogin}
            className="px-4 py-2.5 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors"
          >
            로그인
          </button>
        </div>
        <p className="text-xs text-gray-300 mt-2 text-center">서버에 존재하는 userId를 입력하세요</p>
      </div>
    </div>
  )
}
