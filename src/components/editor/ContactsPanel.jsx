import { useEffect, useState } from 'react'
import { getContacts, putContacts } from '../../api/mcards'
import { SectionTitle, Field, Input, Toggle, SaveBtn, Loader } from './ThemePanel'

const CONTACT_TYPES = [
  { key: 'groom',        label: '신랑' },
  { key: 'bride',        label: '신부' },
  { key: 'groom_father', label: '신랑 아버지' },
  { key: 'groom_mother', label: '신랑 어머니' },
  { key: 'bride_father', label: '신부 아버지' },
  { key: 'bride_mother', label: '신부 어머니' },
]

export default function ContactsPanel({ mcardId, onSaved }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getContacts(mcardId)
      .then((r) => {
        const loaded = r.data.datas || []
        // 없는 타입은 빈값으로 채우기
        const filled = CONTACT_TYPES.map((ct) => {
          const found = loaded.find((c) => c.contactType === ct.key)
          return found || { contactType: ct.key, name: '', phoneNumber: '', isVisible: true }
        })
        setContacts(filled)
      })
      .catch(() => setContacts(CONTACT_TYPES.map((ct) => ({ contactType: ct.key, name: '', phoneNumber: '', isVisible: true }))))
      .finally(() => setLoading(false))
  }, [mcardId])

  const updateContact = (idx, key, val) => {
    setContacts((prev) => prev.map((c, i) => i === idx ? { ...c, [key]: val } : c))
  }

  const save = async () => {
    setSaving(true)
    try { await putContacts(mcardId, { contacts }); onSaved?.('연락처가 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>연락하기</SectionTitle>

      {contacts.map((c, idx) => {
        const type = CONTACT_TYPES.find((t) => t.key === c.contactType)
        return (
          <div key={c.contactType} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{type?.label}</span>
              <Toggle label="표시" checked={c.isVisible} onChange={(v) => updateContact(idx, 'isVisible', v)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="이름">
                <Input value={c.name} onChange={(v) => updateContact(idx, 'name', v)} placeholder="홍길동" />
              </Field>
              <Field label="전화번호">
                <Input value={c.phoneNumber} onChange={(v) => updateContact(idx, 'phoneNumber', v)} placeholder="010-1234-5678" />
              </Field>
            </div>
          </div>
        )
      })}

      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}
