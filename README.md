# Personal Diary Service

개인 일기장 서비스 - Spring Boot + React + PostgreSQL

## 프로젝트 구조
```
diary-service/
├── backend/          # Spring Boot 백엔드
├── frontend/         # React 프론트엔드
├── database/         # PostgreSQL 스키마
└── README.md
```

## 실행 방법

### 1. 데이터베이스 설정
```bash
# PostgreSQL 데이터베이스 생성
createdb diary_service

# 스키마 실행
psql -d diary_service -f database/schema.sql
```

### 2. 백엔드 실행
```bash
cd backend
./mvnw spring-boot:run
```

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```

## 주요 기능
- 회원가입 없는 임시 ID 시스템
- 일기 작성/수정/삭제
- 사진 첨부 (1장, 5MB 제한)
- 검색 기능 (제목, 내용, 날짜)
- 통계 기능 (월별 작성 횟수, 자주 쓰는 단어)
- 다크/라이트 모드 지원
