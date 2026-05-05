import { useEffect, useState } from 'react'
import { getGuestbookSettings, putGuestbookSettings, getGuestbook, deleteGuestbookMsg } from '../../api/mcards'
import { SectionTitle, Toggle, SaveBtn, Loader } from './ThemePanel'

export default function GuestbookPanel({ mcardId, onSaved }) {
  const [settings, setSettings] = useState(null)
  const [messages, setMessages] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getGuestbookSettings(mcardId).catch(() => ({ data: { datas: { isEnabled: true } } })),
      getGuestbook(mcardId).catch(() => ({ data: { datas: [] } })),
    ]).then(([s, m]) => {
      setSettings(s.data.datas)
      setMessages(m.data.datas || [])
    })
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putGuestbookSettings(mcardId, settings); onSaved?.('방명록 설정이 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  const handleDelete = async (mId) => {
    if (!confirm('삭제하시겠습니까?')) return
    try {
      await deleteGuestbookMsg(mcardId, mId)
      setMessages((prev) => prev.filter((m) => m.messageId !== mId))
    } catch { alert('삭제 실패') }
  }

  const formatDate = (dt) => new Date(dt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (!settings) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>방명록</SectionTitle>

      <Toggle
        label="방명록 기능 활성화"
        checked={settings.isEnabled}
        onChange={(v) => setSettings({ ...settings, isEnabled: v })}
      />
      <SaveBtn onClick={save} loading={saving} />

      {/* 메시지 목록 */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">방명록 ({messages.length})</p>
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-300 py-6">방명록 메시지가 없습니다</p>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.messageId} className="bg-gray-50 rounded-lg px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">{m.guestName}</span>
                      {m.isSecret && <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">비밀</span>}
                      <span className="text-xs text-gray-300">{formatDate(m.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{m.content}</p>
                  </div>
                  <button onClick={() => handleDelete(m.messageId)} className="text-gray-300 hover:text-red-400 text-xs ml-2 shrink-0">삭제</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
