import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import KakaoCallbackPage from './pages/KakaoCallbackPage'
import MainPage from './pages/MainPage'
import EditorPage from './pages/EditorPage'
import GuestViewPage from './pages/GuestViewPage'
import PrivateRoute from './components/common/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallbackPage />} />
        <Route path="/w/:inviteCode" element={<GuestViewPage />} />

        {/* 인증 필요 라우트 */}
        <Route path="/" element={<PrivateRoute><MainPage /></PrivateRoute>} />
        <Route path="/editor/:mcardId" element={<PrivateRoute><EditorPage /></PrivateRoute>} />

        {/* 기타 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
