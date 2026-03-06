# KOPIS App - Production Deployment Guide

## CORS 해결 방법

KOPIS API는 CORS를 지원하지 않으므로, 프로덕션 환경에서는 프록시 서버가 필요합니다.

### 방법 1: Express 서버 사용 (자체 호스팅)

1. 빌드 실행:
```bash
npm run build
```

2. 서버 시작:
```bash
npm start
```

3. 브라우저에서 접속:
```
http://localhost:3000/kopis/
```

서버는 다음 기능을 제공합니다:
- `/api/*` → KOPIS API로 프록시 (CORS 문제 해결)
- `/kopis/*` → 정적 파일 제공
- 클라이언트 사이드 라우팅 지원

### 방법 2: Vercel 배포

1. Vercel에 배포:
```bash
npm install -g vercel
vercel
```

`vercel.json` 파일이 자동으로 API 프록시를 설정합니다.

### 방법 3: Netlify 배포

1. Netlify에 배포:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

`netlify.toml` 파일이 자동으로 API 프록시를 설정합니다.

### 방법 4: Nginx 프록시

Nginx 설정 예시:
```nginx
location /kopis/api/ {
    proxy_pass https://www.kopis.or.kr/openApi/restful/;
    proxy_set_header Host www.kopis.or.kr;
    proxy_set_header X-Real-IP $remote_addr;
}

location /kopis/ {
    alias /path/to/dist/;
    try_files $uri $uri/ /kopis/index.html;
}
```

## 환경 변수

`.env` 파일에 KOPIS API 키를 설정하세요:
```
VITE_KOPIS_API_KEY=your_api_key_here
```

## 개발 환경

```bash
npm run dev
```

개발 환경에서는 Vite의 프록시가 자동으로 CORS 문제를 해결합니다.
