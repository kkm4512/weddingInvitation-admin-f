import { useEffect, useState } from 'react'
import { getNotices, postNotice, putNotice, deleteNotice } from '../../api/mcards'
import { SectionTitle, Field, Input, Textarea, Loader } from './ThemePanel'

export default function NoticesPanel({ mcardId, onSaved }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', content: '', displayOrder: 1 })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getNotices(mcardId)
      .then((r) => setNotices(r.data.datas || []))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false))
  }, [mcardId])

  const handleAdd = async () => {
    if (!form.title || !form.content) return alert('제목과 내용을 입력하세요')
    setAdding(true)
    try {
      const res = await postNotice(mcardId, { ...form, displayOrder: notices.length + 1 })
      setNotices((prev) => [...prev, res.data.datas])
      setForm({ title: '', content: '', displayOrder: 1 })
      onSaved?.('안내사항이 추가되었습니다.')
    } catch { alert('추가 실패') }
    finally { setAdding(false) }
  }

  const handleDelete = async (nId) => {
    try {
      await deleteNotice(mcardId, nId)
      setNotices((prev) => prev.filter((n) => n.noticeId !== nId))
    } catch { alert('삭제 실패') }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>안내사항</SectionTitle>

      {/* 등록된 안내사항 */}
      {notices.map((n) => (
        <div key={n.noticeId} className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{n.title}</span>
            <button onClick={() => handleDelete(n.noticeId)} className="text-gray-300 hover:text-red-400 text-xs ml-2">삭제</button>
          </div>
          <p className="text-xs text-gray-500 whitespace-pre-wrap">{n.content}</p>
        </div>
      ))}

      {/* 추가 폼 */}
      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-medium text-gray-500">안내사항 추가</p>
        <Field label="제목">
          <Input value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="주차 안내" />
        </Field>
        <Field label="내용">
          <Textarea value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} placeholder="내용을 입력하세요" rows={3} />
        </Field>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="w-full py-2.5 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {adding ? '추가 중...' : '+ 안내사항 추가'}
        </button>
      </div>
    </div>
  )
}
