import { useEffect, useState } from 'react'
import { getCouple, putCouple } from '../../api/mcards'
import { SectionTitle, Field, Input, Toggle, SaveBtn, Loader } from './ThemePanel'

export default function CouplePanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCouple(mcardId).then((r) => setData(r.data.datas)).catch(() => setData({
      groomName: '', brideName: '',
      groomFatherName: '', groomMotherName: '',
      brideFatherName: '', brideMotherName: '',
      groomFatherDeceased: false, groomMotherDeceased: false,
      brideFatherDeceased: false, brideMotherDeceased: false,
      showGroomContacts: true, showBrideContacts: true,
    }))
  }, [mcardId])

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }))

  const save = async () => {
    setSaving(true)
    try { await putCouple(mcardId, data); onSaved?.('신랑·신부 정보가 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  if (!data) return <Loader />

  return (
    <div className="p-6 space-y-6">
      <SectionTitle>신랑·신부 정보</SectionTitle>

      <div className="grid grid-cols-2 gap-4">
        <Field label="신랑 이름">
          <Input value={data.groomName} onChange={(v) => set('groomName', v)} placeholder="홍길동" />
        </Field>
        <Field label="신부 이름">
          <Input value={data.brideName} onChange={(v) => set('brideName', v)} placeholder="김영희" />
        </Field>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">신랑측 혼주</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input value={data.groomFatherName} onChange={(v) => set('groomFatherName', v)} placeholder="부 홍판서" />
            <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
              <input type="checkbox" checked={data.groomFatherDeceased} onChange={(e) => set('groomFatherDeceased', e.target.checked)} className="accent-[#8b6f5e]" />
              <span className="text-xs text-gray-500">故 표시</span>
            </label>
          </div>
          <div>
            <Input value={data.groomMotherName} onChange={(v) => set('groomMotherName', v)} placeholder="모 이순이" />
            <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
              <input type="checkbox" checked={data.groomMotherDeceased} onChange={(e) => set('groomMotherDeceased', e.target.checked)} className="accent-[#8b6f5e]" />
              <span className="text-xs text-gray-500">故 표시</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">신부측 혼주</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input value={data.brideFatherName} onChange={(v) => set('brideFatherName', v)} placeholder="부 김부장" />
            <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
              <input type="checkbox" checked={data.brideFatherDeceased} onChange={(e) => set('brideFatherDeceased', e.target.checked)} className="accent-[#8b6f5e]" />
              <span className="text-xs text-gray-500">故 표시</span>
            </label>
          </div>
          <div>
            <Input value={data.brideMotherName} onChange={(v) => set('brideMotherName', v)} placeholder="모 박미자" />
            <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
              <input type="checkbox" checked={data.brideMotherDeceased} onChange={(e) => set('brideMotherDeceased', e.target.checked)} className="accent-[#8b6f5e]" />
              <span className="text-xs text-gray-500">故 표시</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-3">
        <Toggle label="신랑측 연락처 표시" checked={data.showGroomContacts} onChange={(v) => set('showGroomContacts', v)} />
        <Toggle label="신부측 연락처 표시" checked={data.showBrideContacts} onChange={(v) => set('showBrideContacts', v)} />
      </div>

      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}
