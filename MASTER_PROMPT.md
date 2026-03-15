# KOPIS Arts — 마스터 프롬프트

## 프로젝트 개요

대한민국 공연예술 탐색 웹앱. KOPIS(공연예술통합전산망) Open API에서 공연 데이터를 가져오고, 네이버 블로그 검색으로 관람 후기를 제공한다.
Cafe24 호스팅에 정적 파일로 배포 (`/kopis` 경로), PHP 프록시로 API CORS 우회.

---

## 기술 스택

| 항목 | 사용 기술 |
|---|---|
| 프레임워크 | React 18 + Vite 4 (SPA, `base: '/kopis/'`) |
| 언어 | JavaScript (JSX) |
| 라우팅 | React Router DOM v6 |
| 스타일 | Tailwind CSS v3 + CSS Custom Variables (다크/라이트 테마) |
| 애니메이션 | Framer Motion |
| 아이콘 | Lucide React |
| HTTP 클라이언트 | axios |
| XML 파싱 | xml-js (`xml2js` compact mode) |
| 데이터 소스 | KOPIS Open API (`www.kopis.or.kr/openApi/restful`) |
| 리뷰 소스 | 네이버 블로그 검색 API |
| 배포 | Cafe24 FTP 업로드 (GitHub Actions) |

---

## 디렉토리 구조

```
src/
├── App.jsx                 # Router 설정 (/ → HomePage, /performance/:id → PerformanceDetail)
├── main.jsx
├── index.css               # CSS Custom Variables 테마 시스템
├── components/
│   ├── Header.jsx          # sticky 헤더 (로고 + 다크/라이트 토글)
│   ├── PerformanceCard.jsx # 공연 카드 (포스터·장르·상태 배지·날짜·장소)
│   ├── ReviewSection.jsx   # 네이버 블로그 후기 섹션
│   └── DonationPopup.jsx   # 후원 팝업
├── hooks/
│   └── useTheme.js         # 다크/라이트 테마 (localStorage + OS preference)
├── pages/
│   ├── HomePage.jsx        # 공연 목록 (필터·검색·페이지네이션)
│   └── PerformanceDetail.jsx # 공연 상세 (포스터·정보·갤러리·예매·리뷰)
└── services/
    ├── api.js              # KOPIS API 호출 (XML → JSON 정규화)
    └── reviewApi.js        # 네이버 블로그 검색 API 호출

public/
├── proxy.php               # PROD: KOPIS API PHP 프록시
└── naver_proxy.php         # PROD: 네이버 API PHP 프록시
```

---

## 핵심 데이터 구조

### 공연 목록 (`fetchPerformances` 반환)
```javascript
{
  id: string,          // mt20id (KOPIS 공연 ID)
  title: string,       // prfnm
  startDate: string,   // prfpdfrom (YYYY.MM.DD)
  endDate: string,     // prfpdto
  place: string,       // fcltynm (공연장명)
  poster: string,      // 포스터 URL (상대경로 시 'http://www.kopis.or.kr' 접두)
  genre: string,       // genrenm
  state: string,       // prfstate ('공연중' | '공연예정' | '공연완료')
  openrun: string,     // 오픈런 여부
}
```

### 공연 상세 (`fetchPerformanceDetail` 반환)
```javascript
{
  ...공연목록 필드,
  cast: string,        // prfcast
  crew: string,        // prfcrew
  runtime: string,     // prfruntime
  age: string,         // prfage
  company: string,     // entrpsnm (기획사)
  price: string,       // pcseguidance (가격 안내)
  story: string,       // sty (줄거리, HTML 태그 포함)
  dtguidance: string,  // 공연 시간 안내
  images: string[],    // styurls.styurl (공연 이미지 배열)
  relates: [{ name, url }], // 예매 채널 (인터파크, 예스24 등)
}
```

---

## API 통신 메커니즘

### 개발 환경 (DEV)
```
클라이언트 → /api/...       → Vite proxy → http://www.kopis.or.kr/openApi/restful/...
클라이언트 → /naver-api?... → Vite proxy → https://openapi.naver.com/v1/search/blog.json
```

### 프로덕션 (Cafe24 정적 호스팅)
```
클라이언트 → /kopis/proxy.php?path=/pblprfr      → KOPIS API
클라이언트 → /kopis/naver_proxy.php              → 네이버 API
```

### KOPIS API 엔드포인트

| 용도 | 경로 |
|---|---|
| 공연 목록 | `GET /pblprfr` |
| 공연 상세 | `GET /pblprfr/{mt20id}` |

### 주요 쿼리 파라미터

| 파라미터 | 설명 |
|---|---|
| `service` | API 키 |
| `stdate` / `eddate` | 기간 (`YYYYMMDD`) |
| `cpage` / `rows` | 페이지 번호 / 페이지당 결과 수 |
| `prfstate` | `01`: 공연예정, `02`: 공연중 (빈값: 전체) |
| `shcate` | 장르 코드 (아래 참조) |
| `signgucode` | 지역 코드 (아래 참조) |
| `shprfnm` | 공연명 검색어 |
| `kidstate` | `Y`: 아동용 필터 |

### XML 응답 파싱 패턴

```javascript
// xml-js compact mode 사용
const json = xml2js(response.data, { compact: true, spaces: 4 });

// 단일/배열 자동 처리
const items = Array.isArray(data.dbs.db) ? data.dbs.db : [data.dbs.db];

// 값 추출
item.prfnm?._text
item.styurls?.styurl  // 단일 or 배열 분기 필요
```

---

## 필터 코드 레퍼런스

### 장르 (`shcate`)
| 코드 | 장르 |
|---|---|
| `AAAA` | 연극 |
| `BBBC` | 무용 |
| `CCCA` | 뮤지컬 |
| `CCCC` | 클래식 |
| `CCCD` | 오페라 |
| `EEEB` | 복합 |

### 지역 (`signgucode`)
| 코드 | 지역 |
|---|---|
| `11` | 서울 |
| `26` | 부산 |
| `27` | 대구 |
| `28` | 인천 |
| `41` | 경기 |
| `50` | 제주 |

### 정렬 (클라이언트 사이드)
| 값 | 정렬 기준 |
|---|---|
| `latest` | 시작일 내림차순 (`startDate` desc) |
| `ending` | 종료일 오름차순 (`endDate` asc) |
| `alphabetical` | 가나다순 (`localeCompare('ko')`) |

---

## 홈 페이지 상태 관리

```javascript
// 필터 초기값 (sessionStorage 복원 지원)
{
  startDate: 'YYYYMMDD',   // 오늘
  endDate: 'YYYYMMDD',     // 오늘 + 120일
  page: 1,
  rows: 50,
  genre: '',
  area: '',
  kid: false,
  keyword: '',
  status: '',
  sortOrder: 'latest',
}
```

- 필터 변경 시 `sessionStorage('kopis_filters')` 저장 → 뒤로가기 복원
- 페이지네이션: 다음 버튼 비활성 조건 → `performances.length < filters.rows`

---

## 테마 시스템 (CSS Custom Variables)

`html[data-theme]` 속성으로 전환. `useTheme()` 훅이 `localStorage` ↔ OS preference 우선순위로 관리.

| 변수 | 다크 | 라이트 |
|---|---|---|
| `--accent-primary` | `#af52de` (System Purple) | `#5856d6` (System Indigo) |
| `--accent-secondary` | `#ff375f` (System Pink) | `#ff2d55` (System Rose) |
| `--bg-primary` | `#000000` | `#f2f2f7` |
| `--bg-card` | `rgba(28,28,30,0.6)` | `rgba(255,255,255,0.7)` |
| `--border-color` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.1)` |

### Tailwind에서 CSS 변수 사용 패턴
```jsx
// 항상 var() 형식으로 참조
className="bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)]"
```

---

## UI 컴포넌트 규칙

### 공연 상태 배지 색상
```javascript
'공연중'   → 'bg-emerald-500/90 text-white border-emerald-400/50'
'공연예정' → 'bg-amber-500/90 text-white border-amber-400/50'
'공연완료' → 'bg-slate-700/90 text-slate-300 border-slate-600/50'
```

### 공연 카드 (`PerformanceCard`)
- `aspect-[3/4]` 포스터 이미지
- 포스터 URL이 상대경로인 경우 `http://www.kopis.or.kr` 접두사 추가
- `whileHover={{ y: -8, scale: 1.02 }}` Framer Motion spring 애니메이션

### 공연 상세 (`PerformanceDetail`)
- 히어로: 포스터 `blur-[100px] opacity-40` 배경 + 그라디언트 오버레이
- 좌측 컬럼 (col-span-4): 포스터 + 예매 채널 링크 (`sticky top-24`)
- 우측 컬럼 (col-span-8): 제목·일정·장소·InfoPill 그리드·Synopsis·Gallery·ReviewSection
- `story` 필드: HTML 태그 제거 후 출력 (`replace(/<[^>]*>/g, '')`)

### CSS 유틸리티 클래스 (index.css에 정의)
- `.glass-panel`: backdrop-blur sticky 헤더용
- `.container`: max-width + padding 컨테이너
- `.flex-between`: `display:flex; justify-content:space-between; align-items:center`
- `.flex-center`: `display:flex; align-items:center`
- `.btn-primary`: 주요 액션 버튼

---

## 배포 설정

```javascript
// vite.config.js
export default defineConfig({
  base: '/kopis/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://www.kopis.or.kr/openApi/restful',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/naver-api': {
        target: 'https://openapi.naver.com/v1/search/blog.json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/naver-api/, ''),
        headers: { 'X-Naver-Client-Id': ..., 'X-Naver-Client-Secret': ... }
      },
    },
  },
})
```

- `npm run build` → `dist/` 디렉토리 생성
- GitHub Actions에서 `dist/` + `public/proxy.php` + `public/naver_proxy.php` → Cafe24 FTP 업로드
- 접속 URL: `https://bsjuuny2026.mycafe24.com/kopis`

---

## 환경 변수

```env
VITE_KOPIS_API_KEY=          # KOPIS Open API 키
VITE_NAVER_CLIENT_ID=        # 네이버 개발자센터 Client ID
VITE_NAVER_CLIENT_SECRET=    # 네이버 개발자센터 Client Secret
```

> API 키는 `import.meta.env.VITE_*` 로 접근. 없을 경우 `localStorage.getItem('kopis_api_key')` 폴백.

---

## 주요 개발 주의사항

- **SPA이므로 Next.js와 달리** SSR/SSG 없음. 모든 데이터 페칭은 `useEffect` 내 클라이언트 사이드
- Cafe24 정적 배포 → 서버 라우팅 없음. React Router의 `BrowserRouter` 사용 시 새로고침 404 주의 → `trailingSlash` + `.htaccess` 또는 PHP redirect로 처리
- KOPIS 포스터 URL은 상대경로(`/upload/pfmPoster/...`)로 오는 경우 있음 → `poster.startsWith('http')` 체크 필수
- xml-js의 `styurl` 필드는 이미지 1개일 때 객체, 여러 개일 때 배열로 반환됨 → `Array.isArray` 분기 필수
- 네이버 블로그 리뷰는 최근 1개월 필터 + 제목 정규화 포함 여부 검증 후 최대 `display` 개수만 반환
