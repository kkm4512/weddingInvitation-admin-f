import { useEffect, useState, useRef } from 'react'
import { getPhotoQuote, putPhotoQuote, uploadPhotoQuoteImage } from '../../api/mcards'
import { SectionTitle, Field, Input, Textarea, SaveBtn, Loader } from './ThemePanel'

export default function PhotoQuotePanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    getPhotoQuote(mcardId)
      .then((r) => setData(r.data.datas))
      .catch(() => setData({ imageUrl: null, quoteText: '' }))
  }, [mcardId])

  const save = async () => {
    setSaving(true)
    try { await putPhotoQuote(mcardId, data); onSaved?.('사진&글귀가 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadPhotoQuoteImage(mcardId, file)
      setData((d) => ({ ...d, imageUrl: res.data.datas.imageUrl || res.data.datas.fileUrl }))
    } catch { alert('업로드 실패') }
    finally { setUploading(false); e.target.value = '' }
  }

  if (!data) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>사진 &amp; 글귀</SectionTitle>

      <Field label="사진">
        <label className="block w-full border-2 border-dashed border-gray-200 hover:border-[#8b6f5e] rounded-xl py-6 text-center cursor-pointer transition-colors">
          <div className="text-2xl mb-1">🖼️</div>
          <span className="text-sm text-gray-400">{uploading ? '업로드 중...' : '사진 선택'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} ref={fileRef} />
        </label>
        {data.imageUrl && (
          <img src={data.imageUrl} alt="미리보기" className="w-32 h-32 rounded-xl mt-2 object-cover mx-auto block" />
        )}
      </Field>

      <Field label="글귀">
        <Textarea
          value={data.quoteText || ''}
          onChange={(v) => setData({ ...data, quoteText: v })}
          placeholder="함께라서 더 행복합니다"
          rows={3}
        />
      </Field>

      <SaveBtn onClick={save} loading={saving} />
    </div>
  )
}
