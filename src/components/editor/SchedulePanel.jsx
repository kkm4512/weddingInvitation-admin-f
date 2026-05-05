import { useEffect, useState } from 'react'
import { getSchedule, putSchedule } from '../../api/mcards'
import { SectionTitle, Field, SaveBtn, Loader } from './ThemePanel'

export default function SchedulePanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSchedule(mcardId)
      .then((r) => setData(r.data.datas))
      .catch(() => setData({ weddingDateTime: '', prepTimeMinutes: 30 }))
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putSchedule(mcardId, data); onSaved?.('예식 일시가 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  if (!data) return <Loader />

  // datetime-local용 포맷 변환
  const toLocal = (dt) => {
    if (!dt) return ''
    return dt.substring(0, 16)
  }

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>예식 일시</SectionTitle>

      <Field label="예식 날짜 및 시간">
        <input
          type="datetime-local"
          value={toLocal(data.weddingDateTime)}
          onChange={(e) => setData({ ...data, weddingDateTime: e.target.value + ':00' })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]"
        />
      </Field>

      <Field label="입장 준비 시간 (분)">
        <input
          type="number"
          min="0"
          max="120"
          value={data.prepTimeMinutes ?? 30}
          onChange={(e) => setData({ ...data, prepTimeMinutes: Number(e.target.value) })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]"
        />
        <p className="text-xs text-gray-400 mt-1">예식 시작 전 입장 준비 시간 (D-Day 계산에 사용)</p>
      </Field>

      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}
