import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { getVenue, putVenue, postTransport, deleteTransport, searchAddress } from '../../api/mcards'
import { SectionTitle, Field, Input, Toggle, SaveBtn, Loader } from './ThemePanel'

const TRANSPORT_TYPES = [
  { key: 'subway', label: '🚇 지하철' },
  { key: 'bus',    label: '🚌 버스' },
  { key: 'car',    label: '🚗 자가용' },
]

export default function VenuePanel({ mcardId, onSaved }) {
  const [data, setData] = useState(null)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [newTransport, setNewTransport] = useState({ transportType: 'subway', description: '', displayOrder: 1 })
  const [addingTransport, setAddingTransport] = useState(false)
  const [mapImageSrc, setMapImageSrc] = useState(null)

  useEffect(() => {
    getVenue(mcardId)
      .then((r) => setData(r.data.datas))
      .catch(() => setData({ venueName: '', hallName: '', address: '', lat: null, lng: null, showMap: true, lockMap: false, showTransportIcons: true, transports: [] }))
  }, [mcardId])

  // 지도 이미지는 Authorization 헤더가 필요하므로 axios로 blob 요청
  useEffect(() => {
    const lat = data?.lat ?? data?.latitude
    const lng = data?.lng ?? data?.longitude
    if (!lat || !lng) { setMapImageSrc(null); return }
    let revoked = false
    api.get(`/address/map?lat=${lat}&lng=${lng}&width=400&height=300`, { responseType: 'blob' })
      .then((r) => { if (!revoked) setMapImageSrc(URL.createObjectURL(r.data)) })
      .catch(() => { if (!revoked) setMapImageSrc(null) })
    return () => { revoked = true }
  }, [data?.lat, data?.lng, data?.latitude, data?.longitude])

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }))

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await searchAddress(searchQuery)
      setSearchResults(res.data.datas?.addresses || [])
    } catch { setSearchResults([]) }
    finally { setSearching(false) }
  }

  const selectAddress = (addr) => {
    setData((d) => ({
      ...d,
      address: addr.roadAddress || addr.addressName,
      lat: addr.latitude,
      lng: addr.longitude,
    }))
    setSearchResults([])
    setSearchQuery('')
  }

  const save = async () => {
    setSaving(true)
    try { await putVenue(mcardId, data); onSaved?.('예식 장소가 저장되었습니다.') }
    catch { alert('저장 실패') }
    finally { setSaving(false) }
  }

  const addTransport = async () => {
    setAddingTransport(true)
    try {
      const res = await postTransport(mcardId, newTransport)
      setData((d) => ({ ...d, transports: [...(d.transports || []), res.data.datas] }))
      setNewTransport({ transportType: 'subway', description: '', displayOrder: 1 })
    } catch { alert('교통수단 추가 실패') }
    finally { setAddingTransport(false) }
  }

  const removeTransport = async (tId) => {
    try {
      await deleteTransport(mcardId, tId)
      setData((d) => ({ ...d, transports: d.transports.filter((t) => t.transportId !== tId) }))
    } catch { alert('삭제 실패') }
  }

  if (!data) return <Loader />

  return (
    <div className="p-6 space-y-5">
      <SectionTitle>예식 장소</SectionTitle>

      <Field label="예식장명">
        <Input value={data.venueName} onChange={(v) => set('venueName', v)} placeholder="더케이호텔 서울" />
      </Field>

      <Field label="홀 정보">
        <Input value={data.hallName} onChange={(v) => set('hallName', v)} placeholder="2층 가야금홀" />
      </Field>

      <Field label="주소 검색">
        <div className="flex gap-2 mb-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="장소명 또는 주소 검색"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-2.5 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {searching ? '...' : '검색'}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => selectAddress(r)}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#fdf0ea] border-b border-gray-50 last:border-0"
              >
                <div className="font-medium text-gray-700">{r.placeName}</div>
                <div className="text-xs text-gray-400">{r.roadAddress}</div>
              </button>
            ))}
          </div>
        )}
        {data.address && (
          <div className="text-xs text-[#8b6f5e] mt-1">선택됨: {data.address}</div>
        )}
      </Field>

      {/* 지도 미리보기 */}
      {(data.lat || data.latitude) && (data.lng || data.longitude) && (
        <Field label="지도 미리보기">
          {mapImageSrc
            ? <img src={mapImageSrc} alt="지도" className="w-48 h-32 object-cover rounded-xl border border-gray-100 mx-auto block" />
            : <div className="w-48 h-32 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-xs text-gray-400 mx-auto">지도 로딩 중...</div>
          }
        </Field>
      )}

      <div className="space-y-3">
        <Toggle label="지도 표시" checked={data.showMap} onChange={(v) => set('showMap', v)} />
        <Toggle label="지도 잠금" checked={data.mapLocked} onChange={(v) => set('mapLocked', v)} />
        <Toggle label="교통수단 아이콘 표시" checked={data.showTransportIcons} onChange={(v) => set('showTransportIcons', v)} />
      </div>

      <SaveBtn onClick={save} loading={saving} />

      {/* 교통수단 */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">교통수단 안내</p>

        {(data.transports || []).map((t) => (
          <div key={t.transportId} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-2 text-sm">
            <span className="text-gray-600">{TRANSPORT_TYPES.find(x => x.key === t.transportType)?.label} {t.description}</span>
            <button onClick={() => removeTransport(t.transportId)} className="text-red-300 hover:text-red-500 ml-2">✕</button>
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
          <select
            value={newTransport.transportType}
            onChange={(e) => setNewTransport((n) => ({ ...n, transportType: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            {TRANSPORT_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
          <input
            value={newTransport.description}
            onChange={(e) => setNewTransport((n) => ({ ...n, description: e.target.value }))}
            placeholder="3호선 양재역 2번 출구 도보 5분"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={addTransport}
            disabled={addingTransport || !newTransport.description}
            className="w-full py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            + 추가
          </button>
        </div>
      </div>
    </div>
  )
}
