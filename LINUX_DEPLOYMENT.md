# KOPIS App - 리눅스 서버 배포 가이드

## 🚀 방법 1: Express 서버 사용 (권장)

가장 간단하고 확실한 방법입니다. CORS 문제를 완벽하게 해결합니다.

### 1단계: 배포 파일 준비

```bash
./deploy.sh
```

이 스크립트는 `deploy` 폴더에 다음 파일들을 준비합니다:
- `dist/` - 빌드된 정적 파일
- `server.js` - Express 프록시 서버
- `package.json` - 의존성 정보
- `.env` - API 키
- `node_modules/` - 프로덕션 의존성

### 2단계: 서버에 업로드

```bash
scp -r deploy/* user@your-server:/var/www/kopis-app/
```

### 3단계: 서버에서 실행

SSH로 서버 접속 후:

```bash
cd /var/www/kopis-app
npm start
```

또는 PM2로 백그라운드 실행 (권장):

```bash
# PM2 설치 (없는 경우)
npm install -g pm2

# 앱 시작
pm2 start server.js --name kopis-app

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save
```

앱은 `http://your-server:3000/kopis/`에서 실행됩니다.

### 포트 변경

기본 포트는 3000입니다. 변경하려면:

```bash
PORT=8080 npm start
```

또는 PM2:

```bash
PORT=8080 pm2 start server.js --name kopis-app
```

---

## 🔧 방법 2: Nginx 프록시 사용

이미 Nginx가 설치되어 있다면 이 방법을 사용할 수 있습니다.

### 1단계: dist 폴더 업로드

```bash
scp -r dist/* user@your-server:/var/www/kopis-app/
```

### 2단계: Nginx 설정

`/etc/nginx/sites-available/kopis-app` 파일 생성:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve static files from /kopis/
    location /kopis/ {
        alias /var/www/kopis-app/;
        try_files $uri $uri/ /kopis/index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Proxy API requests to KOPIS
    location /kopis/api/ {
        rewrite ^/kopis/api/(.*)$ /$1 break;
        
        proxy_pass https://www.kopis.or.kr/openApi/restful;
        proxy_set_header Host www.kopis.or.kr;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_hide_header Access-Control-Allow-Origin;
        add_header Access-Control-Allow-Origin *;
        
        proxy_ssl_server_name on;
        proxy_ssl_verify off;
    }
}
```

### 3단계: Nginx 활성화

```bash
sudo ln -s /etc/nginx/sites-available/kopis-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔍 문제 해결

### CORS 에러가 계속 발생하는 경우

1. **브라우저 개발자 도구**에서 실제 요청 URL 확인
2. **서버 로그** 확인:
   - Express: 콘솔 출력 확인
   - Nginx: `sudo tail -f /var/log/nginx/error.log`

### API 키 에러

`.env` 파일이 서버에 업로드되었는지 확인:

```bash
cat /var/www/kopis-app/.env
```

### 포트가 이미 사용 중인 경우

```bash
# 포트 사용 중인 프로세스 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

---

## 💡 추천 방법

**방법 1 (Express 서버)**을 권장합니다:
- ✅ 설정이 간단함
- ✅ CORS 문제 완벽 해결
- ✅ 개발 환경과 동일한 동작
- ✅ PM2로 안정적인 운영 가능
