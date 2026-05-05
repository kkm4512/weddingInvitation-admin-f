import { useEffect, useState } from 'react'
import { getTheme, putTheme } from '../../api/mcards'

const FONT_OPTIONS = ['고운고딕', '나눔명조', '나눔고딕', 'Noto Serif KR', 'Spoqa Han Sans']
const COLOR_OPTIONS = [
  { key: 'white', label: '화이트', hex: '#ffffff' },
  { key: 'beige', label: '베이지', hex: '#f5efe6' },
  { key: 'pink',  label: '핑크',   hex: '#fff0f3' },
  { key: 'mint',  label: '민트',   hex: '#f0f7f5' },
  { key: 'gray',  label: '그레이', hex: '#f5f5f5' },
]

export default function ThemePanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getTheme(mcardId).then((r) => setData(r.data.datas)).catch(() => {
      setData({ themeStyle: 'classic', color: 'white', fontFamily: '나눔명조', fontWeight: 'normal', preventZoom: false, enableScrollAnimation: true })
    })
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try {
      await putTheme(mcardId, data)
      onSaved?.('테마가 저장되었습니다.')
    } catch {
      alert('저장 실패')
    } finally {
      setSaving(false)
    }
  }

  if (!data) return <Loader />

  return (
    <div className="p-6 space-y-6">
      <SectionTitle>테마 설정</SectionTitle>

      {/* 색상 */}
      <Field label="색상">
        <div className="flex gap-2 flex-wrap">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.key}
              onClick={() => setData({ ...data, color: c.key })}
              title={c.label}
              style={{ background: c.hex }}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                data.color === c.key ? 'border-[#8b6f5e] scale-110' : 'border-gray-200'
              }`}
            />
          ))}
        </div>
      </Field>

      {/* 폰트 */}
      <Field label="글꼴">
        <select
          value={data.fontFamily}
          onChange={(e) => setData({ ...data, fontFamily: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8b6f5e]"
        >
          {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </Field>

      {/* 글꼴 굵기 */}
      <Field label="글꼴 굵기">
        <div className="flex gap-2">
          {[['normal', '보통'], ['bold', '굵게']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setData({ ...data, fontWeight: v })}
              className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                data.fontWeight === v
                  ? 'bg-[#8b6f5e] text-white border-[#8b6f5e]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </Field>

      {/* 옵션 토글 */}
      <Field label="옵션">
        <div className="space-y-3">
          <Toggle
            label="청첩장 확대 방지"
            checked={data.preventZoom}
            onChange={(v) => setData({ ...data, preventZoom: v })}
          />
          <Toggle
            label="스크롤 등장 효과"
            checked={data.enableScrollAnimation}
            onChange={(v) => setData({ ...data, enableScrollAnimation: v })}
          />
        </div>
      </Field>

      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}

// ── 공통 컴포넌트 ──────────────────────────────
export function Loader() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#8b6f5e] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function SectionTitle({ children }) {
  return <h2 className="text-base font-semibold text-gray-800 pb-2 border-b border-gray-100">{children}</h2>
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#8b6f5e]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export function SaveBtn({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-3 bg-[#8b6f5e] hover:bg-[#7a6050] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
    >
      {loading ? '저장 중...' : '저장'}
    </button>
  )
}

export function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]"
    />
  )
}

export function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e] resize-none"
    />
  )
}
