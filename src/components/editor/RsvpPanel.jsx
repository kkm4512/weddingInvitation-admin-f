import { useEffect, useState } from 'react'
import { getRsvpSettings, putRsvpSettings, getRsvpList } from '../../api/mcards'
import { SectionTitle, Toggle, SaveBtn, Loader } from './ThemePanel'

export default function RsvpPanel({ mcardId, onSaved }) {
  const [settings, setSettings] = useState(null)
  const [responses, setResponses] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getRsvpSettings(mcardId).catch(() => ({ data: { datas: { isEnabled: true } } })),
      getRsvpList(mcardId).catch(() => ({ data: { datas: [] } })),
    ]).then(([s, r]) => {
      setSettings(s.data.datas)
      setResponses(r.data.datas || [])
    })
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putRsvpSettings(mcardId, settings); onSaved?.('RSVP 설정이 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  if (!settings) return <Loader />

  const attending = responses.filter((r) => r.willAttend)
  const totalCount = attending.reduce((s, r) => s + (r.attendeeCount || 0), 0)

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>참석의사 (RSVP)</SectionTitle>

      <Toggle
        label="RSVP 기능 활성화"
        checked={settings.isEnabled}
        onChange={(v) => setSettings({ ...settings, isEnabled: v })}
      />
      <SaveBtn onClick={save} loading={saving} />

      {/* 응답 목록 */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">응답 목록</p>
          <span className="text-xs text-[#8b6f5e]">총 {totalCount}명 참석 예정</span>
        </div>
        {responses.length === 0 ? (
          <p className="text-center text-sm text-gray-300 py-6">아직 응답이 없습니다</p>
        ) : (
          <div className="space-y-2">
            {responses.map((r) => (
              <div key={r.responseId} className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700">{r.responderName}</span>
                  <span className="text-xs text-gray-400 ml-2">{r.responderPhone}</span>
                  {r.message && <p className="text-xs text-gray-400 mt-0.5">"{r.message}"</p>}
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.willAttend ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'}`}>
                    {r.willAttend ? `참석 ${r.attendeeCount}명` : '불참'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
