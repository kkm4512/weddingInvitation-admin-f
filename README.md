# 웨딩 초대장 에디터

React + Vite 기반의 웨딩 초대장 프론트엔드입니다.

이 프로젝트는 청첩장 섹션 편집, 갤러리 관리, RSVP, 방명록, 공개 게스트뷰를 제공합니다.

## 주요 기능

- 청첩장 생성 및 관리
- 섹션 순서 드래그 앤 드롭 편집
- 기본 섹션 순서 자동 저장
- 게스트뷰에 동일한 순서로 섹션 표시
- 갤러리 사진 순서 저장 및 관리
- 참석의사 제출 및 방명록 작성
- 연락처, 계좌번호, 예식 정보, 장소, 영상, 배경음악, 안내사항 관리

## 프로젝트 구조

- `src/` - React 애플리케이션 소스
  - `api/` - 백엔드 API 호출 모듈
  - `components/` - 공통 UI 및 에디터 컴포넌트
  - `pages/` - 페이지 단위 컴포넌트
  - `store/` - 상태 관리
- `public/` - 정적 파일
- `vite.config.js` - Vite 설정
- `tailwind.config.js` - Tailwind CSS 설정

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`로 접속합니다.

## 주요 API 엔드포인트

- `GET /api/v1/mcards` - 내 청첩장 목록 조회
- `POST /api/v1/mcards` - 청첩장 생성
- `PUT /api/v1/mcards/{mcardId}/section-order` - 섹션 순서 저장
- `GET /api/v1/mcards/{mcardId}/section-order` - 섹션 순서 조회
- `GET /api/v1/w/{inviteCode}` - 공개 게스트뷰 조회

## 섹션 순서 흐름

1. 새 청첩장 생성 시 기본 섹션 순서를 저장
2. 편집 페이지 진입 시 저장된 순서를 불러옴
3. 순서 변경 시 자동으로 저장
4. 게스트뷰에서도 동일한 순서로 렌더링

## 개발 노트

- `src/components/editor/SectionNav.jsx`에서 섹션 순서를 불러와서 드래그앤드롭으로 관리합니다.
- `src/pages/GuestViewPage.jsx`에서 백엔드가 반환한 `sectionOrder`를 기준으로 섹션을 렌더링합니다.
- `src/pages/MainPage.jsx`에서 청첩장 생성 직후 기본 섹션 순서를 초기 저장합니다.

## 배포

Vercel, Netlify 등의 정적 사이트 호스팅에 배포할 수 있습니다.

```bash
npm run build
```

## 개선 사항

- 인증 및 사용자 흐름 강화
- 모바일 UI 최적화
- 섹션 활성/비활성 토글 추가
- 미리보기 URL 공유 기능 추가
