const SECTIONS = [
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

export default function SectionNav({ active, onChange }) {
  return (
    <nav className="w-44 shrink-0 border-r border-gray-100 bg-white overflow-y-auto">
      <div className="py-3">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
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
