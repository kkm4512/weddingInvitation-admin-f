import { useEffect, useState } from 'react'
import { getAccounts, postAccount, deleteAccount } from '../../api/mcards'
import { SectionTitle, Field, Input, Loader } from './ThemePanel'

const BANKS = ['카카오뱅크', '신한은행', '국민은행', '우리은행', '하나은행', 'NH농협은행', '토스뱅크', 'IBK기업은행', '케이뱅크']

export default function AccountsPanel({ mcardId, onSaved }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ accountType: 'groom', bankName: '카카오뱅크', accountNumber: '', accountHolder: '', displayOrder: 1 })
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    getAccounts(mcardId)
      .then((r) => setAccounts(r.data.datas || []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false))
  }, [mcardId])

  const handleAdd = async () => {
    if (!form.accountNumber || !form.accountHolder) return alert('계좌번호와 예금주를 입력하세요')
    setAdding(true)
    try {
      const res = await postAccount(mcardId, form)
      setAccounts((prev) => [...prev, res.data.datas])
      setForm({ accountType: 'groom', bankName: '카카오뱅크', accountNumber: '', accountHolder: '', displayOrder: 1 })
      onSaved?.('계좌가 추가되었습니다.')
    } catch { alert('추가 실패') }
    finally { setAdding(false) }
  }

  const handleDelete = async (aId) => {
    try {
      await deleteAccount(mcardId, aId)
      setAccounts((prev) => prev.filter((a) => a.accountId !== aId))
    } catch { alert('삭제 실패') }
  }

  if (loading) return <Loader />

  const sideLabel = (s) => s === 'groom' ? '신랑' : '신부'

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>계좌번호</SectionTitle>

      {/* 등록된 계좌 */}
      {accounts.map((a) => (
        <div key={a.accountId} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${a.side === 'groom' || a.accountType === 'groom' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
              {sideLabel(a.side || a.accountType)}
            </span>
            <span className="text-sm font-medium text-gray-700">{a.bankName}</span>
            <p className="text-xs text-gray-500 mt-1">{a.accountNumber} ({a.accountHolder})</p>
          </div>
          <button onClick={() => handleDelete(a.accountId)} className="text-gray-300 hover:text-red-400 text-sm">삭제</button>
        </div>
      ))}

      {/* 추가 폼 */}
      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-medium text-gray-500">계좌 추가</p>

        <div className="flex gap-2">
          {[['groom', '신랑'], ['bride', '신부']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setForm((f) => ({ ...f, accountType: v }))}
              className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${
                form.accountType === v ? 'bg-[#8b6f5e] text-white border-[#8b6f5e]' : 'border-gray-200 text-gray-600'
              }`}
            >
              {l}측
            </button>
          ))}
        </div>

        <select
          value={form.bankName}
          onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]"
        >
          {BANKS.map((b) => <option key={b}>{b}</option>)}
        </select>

        <Field label="계좌번호">
          <Input value={form.accountNumber} onChange={(v) => setForm((f) => ({ ...f, accountNumber: v }))} placeholder="3333-12-3456789" />
        </Field>

        <Field label="예금주">
          <Input value={form.accountHolder} onChange={(v) => setForm((f) => ({ ...f, accountHolder: v }))} placeholder="홍길동" />
        </Field>

        <button
          onClick={handleAdd}
          disabled={adding}
          className="w-full py-2.5 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {adding ? '추가 중...' : '+ 계좌 추가'}
        </button>
      </div>
    </div>
  )
}
