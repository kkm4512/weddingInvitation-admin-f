import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicMcard, submitRsvp, postGuestbook, getGuestbook } from '../api/mcards'

export default function GuestViewPage() {
  const { inviteCode } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [dDay, setDDay] = useState(null)

  // RSVP 폼
  const [rsvpForm, setRsvpForm] = useState({ responderName: '', responderPhone: '', willAttend: true, attendeeCount: 1, message: '' })
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false)

  // 방명록 폼
  const [gbForm, setGbForm] = useState({ guestName: '', content: '', isSecret: false })
  const [messages, setMessages] = useState([])
  const [gbSubmitted, setGbSubmitted] = useState(false)

  // 계좌 복사
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    getPublicMcard(inviteCode)
      .then((r) => {
        const d = r.data.datas
        setData(d)
        if (d.schedule?.weddingDateTime) {
          const diff = Math.ceil((new Date(d.schedule.weddingDateTime) - new Date()) / 86400000)
          setDDay(diff)
        }
        setMessages(d.guestbookMessages || [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [inviteCode])

  const copyAccount = (acc) => {
    navigator.clipboard.writeText(acc.accountNumber)
    setCopiedId(acc.accountId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRsvp = async (e) => {
    e.preventDefault()
    try {
      await submitRsvp(data.mcardId, rsvpForm)
      setRsvpSubmitted(true)
    } catch { alert('제출에 실패했습니다.') }
  }

  const handleGuestbook = async (e) => {
    e.preventDefault()
    try {
      const res = await postGuestbook(data.mcardId, gbForm)
      setMessages((prev) => [res.data.datas, ...prev])
      setGbForm({ guestName: '', content: '', isSecret: false })
      setGbSubmitted(true)
      setTimeout(() => setGbSubmitted(false), 2000)
    } catch { alert('작성에 실패했습니다.') }
  }

  const formatWeddingDate = (dt) => {
    if (!dt) return ''
    const d = new Date(dt)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일 ${d.getHours() < 12 ? '오전' : '오후'} ${d.getHours() % 12 || 12}시 ${d.getMinutes() ? d.getMinutes() + '분' : ''}`
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f4]">
      <div className="w-8 h-8 border-2 border-[#8b6f5e] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f4]">
      <div className="text-center">
        <div className="text-5xl mb-4">💌</div>
        <p className="text-gray-400">청첩장을 찾을 수 없습니다</p>
      </div>
    </div>
  )

  const { couple, greeting, schedule, venue, gallery, rsvpSettings, guestbookSettings, photoQuote, quote, video, bgm, notices } = data || {}

  // 섹션별 렌더링 함수
  const renderSectionContent = (sectionKey) => {
    switch(sectionKey) {
      case 'greeting':
        return greeting && (
          <Section title={greeting.title || '모시는 글'}>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap text-center">
              {greeting.content}
            </p>
          </Section>
        )
      case 'schedule':
        return schedule?.weddingDateTime && (
          <Section title="예식 일시">
            <p className="text-center text-sm text-gray-600">{formatWeddingDate(schedule.weddingDateTime)}</p>
            <MiniCalendar date={new Date(schedule.weddingDateTime)} />
          </Section>
        )
      case 'venue':
        return venue && (
          <Section title="예식 장소">
            <div className="text-center mb-3">
              <p className="font-medium text-gray-700">{venue.venueName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{venue.floorInfo || venue.hallName}</p>
              <p className="text-xs text-gray-400">{venue.address}</p>
            </div>
            {venue.mapImageUrl && venue.mapImageUrl.startsWith('http') && (
              <img src={venue.mapImageUrl} alt="지도" className="w-full rounded-xl mb-3" />
            )}
            {venue.transports && venue.transports.length > 0 && (
              <div className="space-y-2">
                {venue.transports.map((t) => (
                  <div key={t.transportId} className="flex items-start gap-2 text-sm text-gray-500">
                    <span>{(t.transportType || t.type) === 'subway' ? '🚇' : (t.transportType || t.type) === 'bus' ? '🚌' : '🚗'}</span>
                    <span>{t.description}</span>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )
      case 'quote':
        return quote?.quoteContent && (
          <Section title="글귀">
            <p className="text-sm text-gray-500 text-center leading-relaxed whitespace-pre-wrap italic">{quote.quoteContent}</p>
          </Section>
        )
      case 'photoQuote':
        return photoQuote?.imageUrl && (
          <Section title="사진 & 글귀">
            <img src={photoQuote.imageUrl} alt="" className="w-full rounded-2xl object-cover mb-4" />
            {photoQuote.quoteText && (
              <p className="text-sm text-gray-500 text-center leading-relaxed whitespace-pre-wrap">{photoQuote.quoteText}</p>
            )}
          </Section>
        )
      case 'gallery':
        return gallery && gallery.length > 0 && (
          <Section title="갤러리">
            <div className="grid grid-cols-3 gap-1">
              {gallery.map((item, idx) => {
                const src = typeof item === 'string' ? item : (item.publicUrl || item.imageUrl)
                return (
                  <div key={idx} className="relative bg-gray-100" style={{ paddingBottom: '100%' }}>
                    <img
                      src={src}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </Section>
        )
      case 'contacts':
        return data?.contacts && data.contacts.filter(c => c.isVisible !== false).length > 0 && (
          <Section title="연락하기">
            <div className="space-y-2">
              {data.contacts.filter(c => c.isVisible !== false).map((c) => {
                const roleLabel = {
                  groom: '신랑', bride: '신부',
                  groomFather: '신랑 아버지', groomMother: '신랑 어머니',
                  brideFather: '신부 아버지', brideMother: '신부 어머니',
                }[c.contactType || c.role] || c.contactType || c.role
                return (
                  <div key={c.contactId} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <span className="text-xs text-gray-400 mr-2">{roleLabel}</span>
                      <span className="text-sm text-gray-700">{c.name}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{c.phoneNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${c.phoneNumber}`}
                        className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-50">전화</a>
                      <a href={`sms:${c.phoneNumber}`}
                        className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-50">문자</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>
        )
      case 'accounts':
        return data?.accounts && data.accounts.length > 0 && (
          <Section title="마음 전하기">
            <div className="space-y-3">
              {data.accounts.map((a) => (
                <div key={a.accountId} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div>
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${(a.side || a.accountType) === 'groom' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'}`}>
                      {(a.side || a.accountType) === 'groom' ? '신랑' : '신부'}
                    </span>
                    <span className="text-sm text-gray-700">{a.bankName} {a.accountHolder}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{a.accountNumber}</p>
                  </div>
                  <button
                    onClick={() => copyAccount(a)}
                    className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-500 hover:bg-gray-50"
                  >
                    {copiedId === a.accountId ? '복사됨!' : '복사'}
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )
      case 'rsvp':
        return rsvpSettings?.isEnabled !== false && (
          <Section title="참석의사 전달">
            {rsvpSubmitted ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">💌</div>
                <p className="text-sm text-gray-500">소중한 답변 감사합니다!</p>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="space-y-3">
                <div className="flex gap-2">
                  {[true, false].map((v) => (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setRsvpForm((f) => ({ ...f, willAttend: v }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm border transition-colors ${
                        rsvpForm.willAttend === v ? 'bg-[#8b6f5e] text-white border-[#8b6f5e]' : 'border-gray-200 text-gray-500'
                      }`}
                    >
                      {v ? '참석' : '불참'}
                    </button>
                  ))}
                </div>
                <input required placeholder="성함" value={rsvpForm.responderName}
                  onChange={(e) => setRsvpForm((f) => ({ ...f, responderName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]" />
                <input placeholder="연락처" value={rsvpForm.responderPhone}
                  onChange={(e) => setRsvpForm((f) => ({ ...f, responderPhone: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]" />
                {rsvpForm.willAttend && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-500 shrink-0">참석 인원</label>
                    <input type="number" min="1" value={rsvpForm.attendeeCount}
                      onChange={(e) => setRsvpForm((f) => ({ ...f, attendeeCount: Number(e.target.value) }))}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]" />
                  </div>
                )}
                <textarea placeholder="남기실 말씀 (선택)" value={rsvpForm.message} rows={2}
                  onChange={(e) => setRsvpForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e] resize-none" />
                <button type="submit"
                  className="w-full py-3 bg-[#8b6f5e] hover:bg-[#7a6050] text-white text-sm rounded-xl transition-colors">
                  전달하기
                </button>
              </form>
            )}
          </Section>
        )
      case 'guestbook':
        return (guestbookSettings?.isEnabled !== false || messages.length > 0) && (
          <Section title="방명록">
            <form onSubmit={handleGuestbook} className="space-y-3 mb-5">
              <input required placeholder="성함" value={gbForm.guestName}
                onChange={(e) => setGbForm((f) => ({ ...f, guestName: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e]" />
              <textarea required placeholder="축하 메시지를 남겨주세요" rows={3} value={gbForm.content}
                onChange={(e) => setGbForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#8b6f5e] resize-none" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={gbForm.isSecret}
                  onChange={(e) => setGbForm((f) => ({ ...f, isSecret: e.target.checked }))}
                  className="accent-[#8b6f5e]" />
                <span className="text-xs text-gray-500">비밀글</span>
              </label>
              <button type="submit"
                className="w-full py-2.5 bg-white border border-[#8b6f5e] text-[#8b6f5e] text-sm rounded-xl hover:bg-[#fdf0ea] transition-colors">
                {gbSubmitted ? '작성되었습니다 ✓' : '방명록 남기기'}
              </button>
            </form>
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.messageId} className="bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{m.guestName}</span>
                    {m.isSecret && <span className="text-xs text-gray-400">🔒 비밀글</span>}
                  </div>
                  <p className="text-sm text-gray-500">{m.isSecret ? '비밀글입니다.' : m.content}</p>
                </div>
              ))}
            </div>
          </Section>
        )
      case 'bgm':
        return bgm?.bgmUrl && (
          <Section title="배경음악">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-xl">🎵</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{bgm.bgmTitle || '배경음악'}</p>
              </div>
              <audio controls src={bgm.bgmUrl} className="h-8 w-36" />
            </div>
          </Section>
        )
      case 'notices':
        return notices && notices.length > 0 && (
          <Section title="안내사항">
            <div className="space-y-4">
              {notices.map((n) => (
                <div key={n.noticeId}>
                  {n.title && <p className="text-sm font-medium text-gray-700 mb-1">{n.title}</p>}
                  <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                  {n.imageUrl && <img src={n.imageUrl} alt="" className="w-full rounded-xl mt-2 object-cover" />}
                </div>
              ))}
            </div>
          </Section>
        )
      case 'video':
        return video?.videoUrl && (
          <Section title="동영상">
            {video.videoTitle && <p className="text-sm text-gray-500 text-center mb-3">{video.videoTitle}</p>}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={video.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                className="absolute inset-0 w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Section>
        )
      case 'wreath':
        return data?.wreath?.wreathUrl && (
          <Section title="화환 보내기">
            <a href={data.wreath.wreathUrl} target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 text-center border border-[#8b6f5e] text-[#8b6f5e] text-sm rounded-xl hover:bg-[#fdf0ea] transition-colors">
              화환 보내기 →
            </a>
          </Section>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto">

      {/* 인트로 / 헤더 */}
      <div className="relative bg-gradient-to-b from-[#fdf0ea] to-white pt-16 pb-12 text-center px-6">
        <div className="text-xs tracking-[0.3em] text-[#b89a8a] mb-6 uppercase">Wedding Invitation</div>

        {/* 신랑 신부 이름 */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <div>
            {couple?.groomFatherDeceased && <span className="text-xs text-gray-400">故 </span>}
            <div className="text-xs text-gray-400">{couple?.groomFatherName}</div>
            <div className="text-xs text-gray-400">{couple?.groomMotherName}</div>
          </div>
          <div className="text-2xl font-light text-[#8b6f5e]">
            {couple?.groomName || '신랑'}
          </div>
          <div className="text-[#d4b8a8]">♥</div>
          <div className="text-2xl font-light text-[#8b6f5e]">
            {couple?.brideName || '신부'}
          </div>
          <div>
            {couple?.brideFatherDeceased && <span className="text-xs text-gray-400">故 </span>}
            <div className="text-xs text-gray-400">{couple?.brideFatherName}</div>
            <div className="text-xs text-gray-400">{couple?.brideMotherName}</div>
          </div>
        </div>

        {/* D-Day */}
        {dDay !== null && (
          <div className="mt-4 text-sm text-[#b89a8a]">
            {dDay > 0 ? `D - ${dDay}` : dDay === 0 ? 'D - Day' : `D + ${Math.abs(dDay)}`}
          </div>
        )}
      </div>

      {/* 섹션 동적 렌더링 */}
      {data.sectionOrder ? (
        data.sectionOrder.map((sectionKey) => renderSectionContent(sectionKey))
      ) : null}

      {/* 푸터 */}
      <div className="py-10 text-center">
        <p className="text-xs text-gray-200 tracking-widest">from today</p>
      </div>
    </div>
  )
}

// ── 공통 섹션 컨테이너 ──────────────────────────
function Section({ title, children }) {
  return (
    <section className="px-6 py-10 border-t border-gray-50">
      <h2 className="text-xs tracking-[0.25em] text-[#b89a8a] text-center mb-6 uppercase">{title}</h2>
      {children}
    </section>
  )
}

// ── 미니 달력 ───────────────────────────────────
function MiniCalendar({ date }) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const days = ['일', '월', '화', '수', '목', '금', '토']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= lastDate; d++) cells.push(d)

  return (
    <div className="mt-4 bg-gray-50 rounded-2xl p-4">
      <p className="text-xs text-center text-gray-400 mb-3">{year}년 {month + 1}월</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d) => <div key={d} className="text-xs text-gray-300 py-1">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className={`text-xs py-1.5 rounded-full ${d === day ? 'bg-[#8b6f5e] text-white font-medium' : d ? 'text-gray-500' : ''}`}>
            {d || ''}
          </div>
        ))}
      </div>
    </div>
  )
}
