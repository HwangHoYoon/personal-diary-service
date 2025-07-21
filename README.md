# Personal Diary Service

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

개인 일기장 서비스 - Spring Boot + React + PostgreSQL 기반의 회원가입 없는 프라이빗 일기장

## 🌟 주요 특징

- **회원가입 불필요**: 임시 ID 시스템으로 간편한 접근
- **사진 첨부**: 일기당 1장의 사진 첨부 가능 (5MB 제한)
- **검색 기능**: 제목, 내용, 날짜별 검색 지원
- **통계 기능**: 월별 작성 횟수 및 자주 쓰는 단어 분석
- **테마 지원**: 다크/라이트 모드 지원
- **반응형 디자인**: 심플한 노트북 스타일 UI

## 🏗️ 프로젝트 구조

```
diary-service/
├── backend/          # Spring Boot 백엔드
│   ├── src/main/java/com/diary/
│   │   ├── controller/    # REST API 컨트롤러
│   │   ├── service/       # 비즈니스 로직
│   │   ├── repository/    # 데이터 접근 계층
│   │   ├── entity/        # JPA 엔티티
│   │   └── dto/          # 데이터 전송 객체
│   └── src/main/resources/
├── frontend/         # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── services/      # API 서비스
│   │   └── styles/        # 테마 및 스타일
│   └── public/
├── database/         # PostgreSQL 스키마
└── docs/            # 문서
```

## 🚀 실행 방법

### 사전 요구사항
- Java 17 이상
- Node.js 16 이상
- PostgreSQL 12 이상

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
백엔드 서버: http://localhost:8080

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```
프론트엔드 서버: http://localhost:3000

## 📱 주요 기능

### 일기 관리
- ✍️ **일기 작성**: 제목, 내용, 사진 첨부
- 📝 **일기 수정**: 기존 일기 내용 편집
- 🗑️ **일기 삭제**: 확인 메시지와 함께 안전한 삭제
- 📖 **일기 조회**: 카드 형태의 목록 및 상세 보기

### 검색 및 필터링
- 🔍 **제목 검색**: 일기 제목으로 빠른 검색
- 📄 **내용 검색**: 일기 본문 내용으로 검색
- 📅 **날짜 검색**: 특정 기간의 일기 검색

### 통계 및 분석
- 📊 **월별 통계**: 월별 일기 작성 횟수 차트
- 🔤 **단어 분석**: 자주 사용하는 단어 상위 20개
- 📈 **작성 패턴**: 일기 작성 습관 분석

### 사용자 경험
- 🌙 **다크 모드**: 눈에 편한 어두운 테마
- ☀️ **라이트 모드**: 깔끔한 밝은 테마
- 📱 **반응형**: 모바일 및 태블릿 지원

## 🛠️ 기술 스택

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.2.0
- **Styling**: Styled Components
- **Charts**: Recharts
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Build Tool**: Create React App

### Database
- **RDBMS**: PostgreSQL 12+
- **Features**: Full-text search, JSON support

## 📋 API 문서

### 사용자 관리
- `POST /api/users/temp` - 임시 사용자 생성
- `GET /api/users/validate/{tempId}` - 임시 ID 검증

### 일기 관리
- `GET /api/diaries` - 일기 목록 조회
- `GET /api/diaries/{id}` - 일기 상세 조회
- `POST /api/diaries` - 일기 작성
- `PUT /api/diaries/{id}` - 일기 수정
- `DELETE /api/diaries/{id}` - 일기 삭제
- `GET /api/diaries/search` - 일기 검색

### 파일 관리
- `POST /api/files/upload` - 이미지 업로드
- `GET /api/files/{filename}` - 이미지 조회

### 통계
- `GET /api/statistics` - 사용자 통계 조회

## 🔧 개발 환경 설정

### 개발 모드 실행
```bash
# 백엔드 개발 모드
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# 프론트엔드 개발 모드
cd frontend
npm start
```

### 프로덕션 빌드
```bash
# 백엔드 빌드
cd backend
./mvnw clean package

# 프론트엔드 빌드
cd frontend
npm run build
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트 관련 문의사항이나 버그 리포트는 [Issues](https://github.com/HwangHoYoon/personal-diary-service/issues)를 통해 남겨주세요.

---

**즐거운 일기 작성 되세요! 📝✨**
