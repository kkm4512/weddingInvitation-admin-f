import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMcard } from '../api/mcards'
import SectionNav from '../components/editor/SectionNav'
import ThemePanel from '../components/editor/ThemePanel'
import CouplePanel from '../components/editor/CouplePanel'
import GreetingPanel from '../components/editor/GreetingPanel'
import SchedulePanel from '../components/editor/SchedulePanel'
import VenuePanel from '../components/editor/VenuePanel'
import GalleryPanel from '../components/editor/GalleryPanel'
import AccountsPanel from '../components/editor/AccountsPanel'
import ContactsPanel from '../components/editor/ContactsPanel'
import NoticesPanel from '../components/editor/NoticesPanel'
import RsvpPanel from '../components/editor/RsvpPanel'
import GuestbookPanel from '../components/editor/GuestbookPanel'
import { VideoPanel, BgmPanel, WreathPanel, QuotePanel, IntroPanel } from '../components/editor/SimplePanel'
import PhotoQuotePanel from '../components/editor/PhotoQuotePanel'

export default function EditorPage() {
  const { mcardId } = useParams()
  const navigate = useNavigate()
  const [mcard, setMcard] = useState(null)
  const [activeSection, setActiveSection] = useState('theme')
  const [toast, setToast] = useState('')

  useEffect(() => {
    getMcard(mcardId)
      .then((r) => setMcard(r.data.datas))
      .catch(() => navigate('/'))
  }, [mcardId])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const renderPanel = () => {
    const props = { mcardId: Number(mcardId), onSaved: showToast }
    switch (activeSection) {
      case 'theme':      return <ThemePanel {...props} />
      case 'intro':      return <IntroPanel {...props} />
      case 'couple':     return <CouplePanel {...props} />
      case 'greeting':   return <GreetingPanel {...props} />
      case 'schedule':   return <SchedulePanel {...props} />
      case 'venue':      return <VenuePanel {...props} />
      case 'gallery':    return <GalleryPanel {...props} />
      case 'contacts':   return <ContactsPanel {...props} />
      case 'accounts':   return <AccountsPanel {...props} />
      case 'video':      return <VideoPanel {...props} />
      case 'bgm':        return <BgmPanel {...props} />
      case 'notices':    return <NoticesPanel {...props} />
      case 'rsvp':       return <RsvpPanel {...props} />
      case 'guestbook':  return <GuestbookPanel {...props} />
      case 'wreath':     return <WreathPanel {...props} />
      case 'quote':      return <QuotePanel {...props} />
      case 'photoQuote': return <PhotoQuotePanel {...props} />
      default:           return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="h-14 border-b border-gray-100 flex items-center justify-between px-5 shrink-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm">
            ← 목록
          </button>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{mcard?.title || '청첩장 편집'}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* 공개 보기 */}
          {mcard?.inviteCode && (
            <button
              onClick={() => window.open(`/w/${mcard.inviteCode}`, '_blank')}
              className="text-sm text-[#8b6f5e] hover:underline"
            >
              공개 보기 →
            </button>
          )}
          {/* 초대코드 복사 */}
          {mcard?.inviteCode && (
            <button
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/w/${mcard.inviteCode}`); showToast('링크가 복사되었습니다.') }}
              className="text-sm bg-[#8b6f5e] hover:bg-[#7a6050] text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              링크 복사
            </button>
          )}
        </div>
      </header>

      {/* 본문: 네비 + 패널 + 미리보기 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 섹션 네비 */}
        <SectionNav active={activeSection} onChange={setActiveSection} />

        {/* 중앙 편집 패널 */}
        <div className="flex-1 overflow-y-auto bg-white">
          {renderPanel()}
        </div>

        {/* 우측 미리보기 (모바일 프레임) */}
        <div className="w-80 shrink-0 border-l border-gray-100 bg-gray-50 flex flex-col items-center justify-start pt-6 overflow-hidden">
          <p className="text-xs text-gray-400 mb-3">미리보기</p>
          <div className="relative w-52 h-[440px] bg-white rounded-[2rem] border-4 border-gray-200 shadow-lg overflow-hidden">
            {mcard?.inviteCode ? (
              <iframe
                src={`/w/${mcard.inviteCode}`}
                className="w-full h-full border-0 scale-75 origin-top-left"
                style={{ width: '133%', height: '133%' }}
                title="미리보기"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-xs text-gray-300 text-center px-4">저장 후<br/>미리보기가 표시됩니다</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 저장 완료 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50 animate-fade-in">
          ✓ {toast}
        </div>
      )}
    </div>
  )
}
