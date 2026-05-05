import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMcards, createMcard, deleteMcard, putSectionOrder } from '../api/mcards'
import { getMe } from '../api/auth'
import useAuthStore from '../store/authStore'

const DEFAULT_SECTION_ORDER = [
  'theme', 'intro', 'couple', 'greeting', 'schedule', 'venue', 'gallery',
  'contacts', 'accounts', 'video', 'bgm', 'notices', 'rsvp', 'guestbook', 'wreath', 'quote', 'photoQuote'
]

export default function MainPage() {
  const navigate = useNavigate()
  const { logout, setUser, user } = useAuthStore()
  const [mcards, setMcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [meRes, cardsRes] = await Promise.all([getMe(), getMcards()])
      setUser(meRes.data.datas)
      setMcards(cardsRes.data.datas || [])
    } catch {
      // 401이면 인터셉터에서 처리
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    const title = prompt('청첩장 제목을 입력하세요')
    if (!title) return
    setCreating(true)
    try {
      const res = await createMcard({ title })
      const newId = res.data.datas.mcardId
      // 청첩장 생성 후 기본 section-order 저장
      await putSectionOrder(newId, { sectionOrder: DEFAULT_SECTION_ORDER })
      navigate(`/editor/${newId}`)
    } catch {
      alert('청첩장 생성에 실패했습니다.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await deleteMcard(id)
      setMcards((prev) => prev.filter((c) => c.mcardId !== id))
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const formatDate = (dt) => {
    if (!dt) return '예식일 미설정'
    const d = new Date(dt)
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="text-xl font-light tracking-widest text-[#8b6f5e]">from today</div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-500">{user.name}님</span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* 타이틀 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">내 청첩장</h1>
            <p className="text-sm text-gray-400 mt-1">소중한 분들에게 청첩장을 전해보세요</p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 bg-[#8b6f5e] hover:bg-[#7a6050] text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            <span className="text-lg leading-none">+</span>
            새 청첩장 만들기
          </button>
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#8b6f5e] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : mcards.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💌</div>
            <p className="text-gray-400 text-sm">아직 만든 청첩장이 없어요</p>
            <p className="text-gray-300 text-xs mt-1">새 청첩장 만들기 버튼을 눌러 시작하세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mcards.map((card) => (
              <div
                key={card.mcardId}
                onClick={() => navigate(`/editor/${card.mcardId}`)}
                className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-[#d4b8a8] transition-all group"
              >
                {/* 썸네일 영역 */}
                <div className="bg-gradient-to-br from-[#fdf0ea] to-[#f5e6de] rounded-xl h-36 mb-4 flex items-center justify-center">
                  <span className="text-4xl">💍</span>
                </div>

                <h3 className="font-medium text-gray-800 text-sm truncate mb-1">{card.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{formatDate(card.weddingDateTime)}</p>

                <div className="flex items-center justify-between">
                  {/* 공개 링크 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const url = `/w/${card.inviteCode}`
                      window.open(url, '_blank')
                    }}
                    className="text-xs text-[#8b6f5e] hover:underline"
                  >
                    공개 보기 →
                  </button>
                  <button
                    onClick={(e) => handleDelete(card.mcardId, e)}
                    className="text-xs text-gray-300 hover:text-red-400 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
