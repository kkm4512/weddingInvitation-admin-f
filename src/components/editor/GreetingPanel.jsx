import { useEffect, useState } from 'react'
import { getGreeting, putGreeting, getGreetingSamples } from '../../api/mcards'
import { SectionTitle, Field, Input, Textarea, SaveBtn, Loader } from './ThemePanel'

export default function GreetingPanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [samples, setSamples] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getGreeting(mcardId).catch(() => ({ data: { datas: { title: '', content: '', fontSize: 'medium' } } })),
      getGreetingSamples().catch(() => ({ data: { datas: [] } })),
    ]).then(([gr, sm]) => {
      setData(gr.data.datas)
      setSamples(sm.data.datas || [])
    })
  }, [mcardId])

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }))

  const save = async () => {
    setSaving(true)
    try { await putGreeting(mcardId, data); onSaved?.('모시는 글이 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  if (!data) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>모시는 글</SectionTitle>

      <Field label="제목">
        <Input value={data.title} onChange={(v) => set('title', v)} placeholder="저희 결혼합니다" />
      </Field>

      <Field label="본문">
        <Textarea
          value={data.content}
          onChange={(v) => set('content', v)}
          placeholder="초대의 말씀을 입력하세요"
          rows={6}
        />
      </Field>

      <Field label="글자 크기">
        <div className="flex gap-2">
          {[['small', '작게'], ['medium', '보통'], ['large', '크게']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => set('fontSize', v)}
              className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                data.fontSize === v ? 'bg-[#8b6f5e] text-white border-[#8b6f5e]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </Field>

      {/* 샘플 문구 */}
      {samples.length > 0 && (
        <Field label="샘플 문구">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {samples.map((s) => (
              <button
                key={s.id}
                onClick={() => set('content', s.text)}
                className="w-full text-left text-xs text-gray-500 bg-gray-50 hover:bg-[#fdf0ea] hover:text-[#8b6f5e] px-3 py-2 rounded-lg transition-colors line-clamp-2"
              >
                {s.text}
              </button>
            ))}
          </div>
        </Field>
      )}

      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}
