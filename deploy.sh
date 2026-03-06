#!/bin/bash

# KOPIS App 배포 스크립트

echo "🚀 KOPIS App 배포 시작..."

# 1. 빌드
echo "📦 빌드 중..."
npm run build

# 2. 배포할 파일들을 deploy 폴더에 복사
echo "📁 배포 파일 준비 중..."
rm -rf deploy
mkdir -p deploy

# dist 폴더 복사
cp -r dist deploy/

# 서버 파일 복사
cp server.js deploy/
cp package.json deploy/

# .env 파일 복사 (API 키 포함)
cp .env deploy/

# node_modules 중 프로덕션 의존성만 설치
cd deploy
echo "📥 프로덕션 의존성 설치 중..."
npm install --production

cd ..

echo "✅ 배포 준비 완료!"
echo ""
echo "📤 deploy 폴더를 서버에 업로드하세요:"
echo "   scp -r deploy/* user@your-server:/path/to/app/"
echo ""
echo "🖥️  서버에서 다음 명령어로 실행:"
echo "   cd /path/to/app"
echo "   npm start"
echo ""
echo "💡 또는 PM2로 백그라운드 실행:"
echo "   pm2 start server.js --name kopis-app"
