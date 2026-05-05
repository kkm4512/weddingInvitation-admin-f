import { useEffect, useState } from 'react'
import { getSectionOrder, putSectionOrder } from '../../api/mcards'

const DEFAULT_SECTIONS = [
  { key: 'theme',      label: '테마' },
  { key: 'intro',      label: '인트로' },
  { key: 'couple',     label: '신랑·신부' },
  { key: 'greeting',   label: '모시는 글' },
  { key: 'schedule',   label: '예식 일시' },
  { key: 'venue',      label: '예식 장소' },
  { key: 'gallery',    label: '갤러리' },
  { key: 'contacts',   label: '연락하기' },
  { key: 'accounts',   label: '계좌번호' },
  { key: 'video',      label: '동영상' },
  { key: 'bgm',        label: '배경음악' },
  { key: 'notices',    label: '안내사항' },
  { key: 'rsvp',       label: '참석의사' },
  { key: 'guestbook',  label: '방명록' },
  { key: 'wreath',     label: '화환 보내기' },
  { key: 'quote',      label: '글귀' },
  { key: 'photoQuote', label: '사진&글귀' },
]

export default function SectionNav({ mcardId, active, onChange }) {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mcardId) {
      setLoading(false)
      return
    }
    getSectionOrder(mcardId)
      .then((r) => {
        const order = r.data.datas?.sectionOrder || []
        if (order.length > 0) {
          // 서버의 순서에 맞춰 정렬
          const ordered = order
            .map((key) => DEFAULT_SECTIONS.find((s) => s.key === key))
            .filter(Boolean)
          // 서버에 없는 섹션은 뒤에 추가
          const missing = DEFAULT_SECTIONS.filter((s) => !order.includes(s.key))
          setSections([...ordered, ...missing])
        }
      })
      .catch(() => setSections(DEFAULT_SECTIONS))
      .finally(() => setLoading(false))
  }, [mcardId])

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newSections = [...sections]
    const draggedSection = newSections[draggedIndex]
    newSections.splice(draggedIndex, 1)
    newSections.splice(targetIndex, 0, draggedSection)

    setSections(newSections)
    setDraggedIndex(targetIndex)
  }

  const handleDragEnd = async (e) => {
    e.preventDefault()
    if (draggedIndex !== null) {
      setDraggedIndex(null)
      // 순서 변경 후 자동으로 저장
      if (mcardId) {
        try {
          await putSectionOrder(mcardId, {
            sectionOrder: sections.map((s) => s.key),
          })
        } catch {
          alert('섹션 순서 저장 실패')
        }
      }
    }
  }

  if (loading) {
    return (
      <nav className="w-44 shrink-0 border-r border-gray-100 bg-white overflow-y-auto">
        <div className="py-3 px-4 text-sm text-gray-400">로딩 중...</div>
      </nav>
    )
  }

  return (
    <nav className="w-44 shrink-0 border-r border-gray-100 bg-white overflow-y-auto">
      <div className="py-3">
        {sections.map((s, index) => (
          <button
            key={s.key}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onClick={() => onChange(s.key)}
            className={`w-full text-left px-4 py-2.5 text-sm transition-all cursor-move ${
              draggedIndex === index ? 'opacity-50 bg-gray-100' : ''
            } ${
              active === s.key
                ? 'bg-[#fdf0ea] text-[#8b6f5e] font-medium border-r-2 border-[#8b6f5e]'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
