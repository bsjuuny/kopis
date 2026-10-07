# 🎭 KOPIS (공연 통합 대시보드) 개발자 가이드

안녕하세요! 이 프로젝트는 우리나라의 모든 연극, 뮤지컬, 클래식 공연 정보를 한눈에 모아보고, 어떤 공연이 현재 잘 나가는지 분석해주는 대시보드 서비스입니다.

---

## 🏗 시스템 작동 방식

1.  **데이터 가져오기**: 공연예술 통합전산망(KOPIS) API에서 실시간 공연 데이터를 연동합니다.
2.  **데이터 가공**: 복잡한 XML 데이터를 읽기 쉬운 JSON으로 변환하여 화면에 뿌려줍니다.
3.  **서비스 제공**: Next.js를 사용하여 빠르고 모던한 검색/상세 페이지를 사용자에게 제공합니다.

---

## 🛠 주요 명령어 및 배포 가이드

- `npm run dev`: 공연 목록 화면을 수정하거나 검색 기능을 개선하고 싶을 때 실행하세요.
- `npm run build`: 실제 서버에 올리기 위해 파일을 압축하고 최적화합니다.

---

## 💡 개발자를 위한 팁

### 배포 환경 (Cafe24)
- 실제로 쓰는 배포 방식은 Cafe24 정적 호스팅(`basePath: '/kopis'`)입니다. `CAFE24_DEPLOYMENT.md`, `DEPLOYMENT.md`, `LINUX_DEPLOYMENT.md`, `nginx.conf`, `deploy.sh`처럼 배포 문서가 여러 개 있는데, 서로 다른 시점의 시도 흔적일 수 있으니 문서보다 최신 `next.config.ts` 설정을 우선 신뢰하세요.
- **`legacy-vite/`, `dist/`, `server.js`는 이 프로젝트의 옛날 버전(Vite + Express 프록시)의 잔재이며 현재 사용되지 않습니다.** 실제로 손대야 할 코드는 `src/`(Next.js App Router)뿐입니다 — legacy 스택을 다뤄달라는 명시적 요청이 아니면 이 파일들은 건드리지 마세요.

### API 키 관리
- `.env` 파일에 KOPIS에서 발급받은 API 키를 넣어야 정상적으로 데이터가 나옵니다. 키가 없으면 화면에 아무것도 나오지 않을 수 있습니다.

---

## 🚨 문제 해결 (Troubleshooting)

**Q: 공연 이미지가 안 보여요.**
- A: KOPIS API에서 주는 포스터 링크가 깨졌거나, `Next.js Image` 컴포넌트의 `domain` 설정에 해당 원격 주소가 등록되지 않았을 수 있습니다.

**Q: 검색 결과가 너무 적어요.**
- A: API 호출 시 날짜 범위(`stdate`, `eddate`)가 너무 좁게 설정되어 있는지 `src/lib/` 코드를 확인해 보세요.

---

## 📁 주요 구성 요소
- `src/services/api.ts`, `src/services/reviewApi.ts`: KOPIS/Naver API 연동.
- `src/lib/recommendation.ts`, `src/lib/security.ts`
- `src/app/{performance,favorites,login,recommendations}`: 주요 라우트.
- `server.js`, `nginx.conf`, `legacy-vite/`, `dist/`: 옛날 Vite+Express 버전의 잔재, 현재 미사용 (위 참고).
