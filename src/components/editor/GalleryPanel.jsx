import { useEffect, useState, useRef } from 'react'
import { getGallery, uploadPhoto, deletePhoto, putGalleryOrder } from '../../api/mcards'
import { SectionTitle, Loader } from './ThemePanel'

export default function GalleryPanel({ mcardId, onSaved }) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const fileRef = useRef()
  const dragCounterRef = useRef(0)

  useEffect(() => {
    getGallery(mcardId)
      .then((r) => {
        const sorted = (r.data.datas || []).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        setPhotos(sorted)
      })
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false))
  }, [mcardId])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const res = await uploadPhoto(mcardId, file)
        setPhotos((prev) => [...prev, res.data.datas])
      }
      onSaved?.('사진이 업로드되었습니다.')
    } catch { alert('업로드 실패') }
    finally { setUploading(false); e.target.value = '' }
  }

  const handleDelete = async (photoId) => {
    if (!confirm('사진을 삭제하시겠습니까?')) return
    try {
      await deletePhoto(mcardId, photoId)
      setPhotos((prev) => prev.filter((p) => p.photoId !== photoId))
    } catch { alert('삭제 실패') }
  }

  const saveOrder = async (newPhotos) => {
    try {
      const photoOrderItems = newPhotos.map((p, index) => ({
        photoId: p.photoId,
        displayOrder: index + 1,
      }))
      await putGalleryOrder(mcardId, photoOrderItems)
      onSaved?.('순서가 저장되었습니다.')
    } catch { alert('순서 저장 실패') }
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, targetIndex) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex === null || draggedIndex === targetIndex) return

    const newPhotos = [...photos]
    const draggedPhoto = newPhotos[draggedIndex]
    newPhotos.splice(draggedIndex, 1)
    newPhotos.splice(targetIndex, 0, draggedPhoto)
    
    setPhotos(newPhotos)
    setDraggedIndex(targetIndex)
  }

  const handleDragEnd = async (e) => {
    e.preventDefault()
    if (draggedIndex !== null) {
      setDraggedIndex(null)
      // 순서 변경 후 자동으로 저장
      await saveOrder(photos)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>갤러리</SectionTitle>

      {/* 업로드 버튼 */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-gray-200 hover:border-[#8b6f5e] rounded-xl py-8 text-center transition-colors disabled:opacity-50"
      >
        <div className="text-3xl mb-2">{uploading ? '⏳' : '📷'}</div>
        <p className="text-sm text-gray-400">{uploading ? '업로드 중...' : '사진 추가 (다중 선택 가능)'}</p>
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />

      {/* 사진 그리드 */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.photoId}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square cursor-move transition-opacity ${
                draggedIndex === index ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <img
                src={photo.imageUrl || photo.publicUrl}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(photo.photoId)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <p className="text-center text-sm text-gray-300 py-4">업로드된 사진이 없습니다</p>
      )}
    </div>
  )
}
