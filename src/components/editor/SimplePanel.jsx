/**
 * 단순 PUT 섹션들을 하나의 컴포넌트로 처리 (video, bgm, wreath, quote, intro)
 */
import { useEffect, useState } from 'react'
import { SectionTitle, Field, Input, Textarea, Toggle, SaveBtn, Loader } from './ThemePanel'
import {
  getVideo, putVideo,
  getBgm, putBgm, uploadBgm,
  getWreath, putWreath,
  getQuote, putQuote, getQuoteSamples,
  getIntro, putIntro, getIntros,
} from '../../api/mcards'

// ── 동영상 ─────────────────────────────────────
export function VideoPanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getVideo(mcardId).then((r) => setData(r.data.datas)).catch(() => setData({ videoUrl: '', videoTitle: '' }))
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putVideo(mcardId, data); onSaved?.('동영상이 저장되었습니다.') }
    catch { alert('저장 실패') } finally { setSaving(false) }
  }

  if (!data) return <Loader />
  return (
    <div className="p-6 space-y-5">
      <SectionTitle>동영상</SectionTitle>
      <Field label="제목"><Input value={data.videoTitle} onChange={(v) => setData({ ...data, videoTitle: v })} placeholder="우리의 이야기" /></Field>
      <Field label="YouTube / Vimeo URL"><Input value={data.videoUrl} onChange={(v) => setData({ ...data, videoUrl: v })} placeholder="https://www.youtube.com/watch?v=..." /></Field>
      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}

// ── 배경음악 ────────────────────────────────────
export function BgmPanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getBgm(mcardId).then((r) => setData(r.data.datas)).catch(() => setData({ bgmUrl: '', bgmTitle: '', autoPlay: false }))
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putBgm(mcardId, data); onSaved?.('배경음악이 저장되었습니다.') }
    catch { alert('저장 실패') } finally { setSaving(false) }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try { const res = await uploadBgm(mcardId, file); setData((d) => ({ ...d, bgmUrl: res.data.datas.bgmUrl, bgmTitle: d.bgmTitle || file.name })) }
    catch { alert('업로드 실패') } finally { setUploading(false); e.target.value = '' }
  }

  if (!data) return <Loader />
  return (
    <div className="p-6 space-y-5">
      <SectionTitle>배경음악</SectionTitle>
      <Field label="음악 파일 업로드">
        <label className="block w-full border-2 border-dashed border-gray-200 hover:border-[#8b6f5e] rounded-xl py-6 text-center cursor-pointer transition-colors">
          <div className="text-2xl mb-1">🎵</div>
          <span className="text-sm text-gray-400">{uploading ? '업로드 중...' : '음악 파일 선택 (mp3, ogg 등)'}</span>
          <input type="file" accept="audio/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
        {data.bgmUrl && <p className="text-xs text-[#8b6f5e] mt-1 truncate">✓ {data.bgmUrl}</p>}
      </Field>
      <Field label="음악 제목"><Input value={data.bgmTitle} onChange={(v) => setData({ ...data, bgmTitle: v })} placeholder="A Thousand Years" /></Field>
      <Toggle label="자동재생" checked={data.autoPlay} onChange={(v) => setData({ ...data, autoPlay: v })} />
      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}

// ── 화환 보내기 ─────────────────────────────────
export function WreathPanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getWreath(mcardId).then((r) => setData(r.data.datas)).catch(() => setData({ wreathUrl: '' }))
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putWreath(mcardId, data); onSaved?.('화환 URL이 저장되었습니다.') }
    catch { alert('저장 실패') } finally { setSaving(false) }
  }

  if (!data) return <Loader />
  return (
    <div className="p-6 space-y-5">
      <SectionTitle>화환 보내기</SectionTitle>
      <Field label="화환 업체 URL"><Input value={data.wreathUrl} onChange={(v) => setData({ ...data, wreathUrl: v })} placeholder="https://..." /></Field>
      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}

// ── 글귀 ────────────────────────────────────────
export function QuotePanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [samples, setSamples] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getQuote(mcardId).catch(() => ({ data: { datas: { quoteContent: '', fontSize: 'medium' } } })),
      getQuoteSamples().catch(() => ({ data: { datas: [] } })),
    ]).then(([q, s]) => { setData(q.data.datas); setSamples(s.data.datas || []) })
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putQuote(mcardId, data); onSaved?.('글귀가 저장되었습니다.') }
    catch { alert('저장 실패') } finally { setSaving(false) }
  }

  if (!data) return <Loader />
  return (
    <div className="p-6 space-y-5">
      <SectionTitle>글귀</SectionTitle>
      <Field label="글귀 내용">
        <Textarea value={data.quoteContent} onChange={(v) => setData({ ...data, quoteContent: v })} placeholder="사랑은..." rows={4} />
      </Field>
      <Field label="글자 크기">
        <div className="flex gap-2">
          {[['small','작게'],['medium','보통'],['large','크게']].map(([v,l]) => (
            <button key={v} onClick={() => setData({ ...data, fontSize: v })}
              className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${data.fontSize===v?'bg-[#8b6f5e] text-white border-[#8b6f5e]':'border-gray-200 text-gray-600'}`}>{l}</button>
          ))}
        </div>
      </Field>
      {samples.length > 0 && (
        <Field label="샘플 문구">
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {samples.map((s) => (
              <button key={s.id} onClick={() => setData({ ...data, quoteContent: s.text })}
                className="w-full text-left text-xs text-gray-500 bg-gray-50 hover:bg-[#fdf0ea] px-3 py-2 rounded-lg transition-colors line-clamp-2">
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

// ── 인트로 ──────────────────────────────────────
export function IntroPanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [intros, setIntros] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getIntro(mcardId).catch(() => ({ data: { datas: { introStyleKey: 'DEFAULT' } } })),
      getIntros().catch(() => ({ data: { datas: [] } })),
    ]).then(([d, i]) => { setData(d.data.datas); setIntros(i.data.datas || []) })
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putIntro(mcardId, data); onSaved?.('인트로가 저장되었습니다.') }
    catch { alert('저장 실패') } finally { setSaving(false) }
  }

  if (!data) return <Loader />

  const defaultKeys = ['DEFAULT', 'OVAL', 'EDGE', 'FILL', 'LARGE']

  // 서버가 반환하는 필드명이 다를 수 있으므로 여러 후보를 시도
  const extractKey = (i) =>
    i.introStyleKey || i.styleKey || i.key || i.id || i.code || i.name || null

  const introItems = intros.length > 0
    ? intros.map((i) => ({ key: extractKey(i), label: i.label || i.name || extractKey(i) })).filter((it) => it.key)
    : defaultKeys.map((k) => ({ key: k, label: k }))

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>인트로 설정</SectionTitle>
      <Field label="인트로 스타일">
        <div className="grid grid-cols-3 gap-2">
          {introItems.map(({ key: k, label: l }) => (
            <button key={k} onClick={() => setData({ ...data, introStyleKey: k })}
              className={`py-3 rounded-xl text-xs border transition-all ${data.introStyleKey===k?'bg-[#8b6f5e] text-white border-[#8b6f5e]':'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </Field>
      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}
