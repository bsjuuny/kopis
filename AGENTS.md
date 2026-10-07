# KOPIS 공연 통합 대시보드

한국 공연예술(연극/뮤지컬/클래식) 정보를 KOPIS API로 모아 보여주는 검색/추천 대시보드.

## Tech Stack
- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3
- zustand, @tanstack/react-query, axios, xml-js (KOPIS XML → JSON), isomorphic-dompurify
- 데이터: KOPIS 공연예술통합전산망 API (`KOPIS_API_KEY`), Naver 검색 API (`NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`) — 전부 서버 전용 이름. 브라우저 코드는 키를 보내지 않는다(2026-09-30). `.env`의 `NEXT_PUBLIC_` 이름은 삭제 대기 중인 예비 값

## Commands
- `npm run dev`
- `npm run build` — `NODE_ENV=production`일 때만 정적 export (`next.config.ts`)
- `npm run lint`, `npm start`

## Key Files
- `src/services/api.ts`, `src/services/reviewApi.ts`
- `src/lib/recommendation.ts`, `src/lib/security.ts`
- `src/middleware.ts`
- `src/app/{performance,favorites,login,recommendations}` — 라우트
- `next.config.ts` — `basePath: '/kopis'`, `/api/:path*` → `http://www.kopis.or.kr/openApi/restful/:path*` rewrite

## Gotchas
- **저장소 루트의 `legacy-vite/`, `dist/`, `server.js`는 이 프로젝트의 옛날 버전(Vite + Express 프록시)의 잔재이며 현재 사용되지 않음.** 실제로 작업해야 할 코드는 `src/`(Next.js App Router)뿐임 — `legacy-vite/`나 `server.js`를 고쳐도 배포에 반영되지 않으니, 명시적으로 legacy 스택을 다루라는 요청이 아니면 건드리지 말 것.
- 프로덕션 KOPIS·Naver 요청은 `public/proxy.php`·`public/naver_proxy.php`가 중계하고, 키는 `public/kopis_proxy_config.php`·`public/naver_proxy_config.php`(git 제외)에서 읽는다.
- 키 원본은 `.env`. `npm run build`의 prebuild(`scripts/write-proxy-config.mjs`)가 `.env`에서 위 설정 파일 2개를 만들고 빌드 결과(`out/`)에 함께 들어간다. 키를 바꾸면 `.env`만 고치고 빌드 후 업로드(설정 파일만 바뀌었으면 그 2개만 올려도 됨).
- 배포 관련 문서가 여러 개 있음: `CAFE24_DEPLOYMENT.md`, `DEPLOYMENT.md`, `LINUX_DEPLOYMENT.md`, `nginx.conf`, `deploy.sh` — 실제 사용 중인 배포 방식(Cafe24 정적 호스팅, `basePath: /kopis`)과 다른 문서는 과거 시도의 흔적일 수 있으니 최신 next.config.ts 설정을 우선 신뢰할 것.
