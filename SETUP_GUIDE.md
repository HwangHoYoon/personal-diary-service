# Personal Diary Service 실행 가이드

## 사전 요구사항

### 1. Java 17 이상
```bash
java -version
```

### 2. Node.js 16 이상
```bash
node --version
npm --version
```

### 3. PostgreSQL 12 이상
```bash
psql --version
```

## 데이터베이스 설정

### 1. PostgreSQL 데이터베이스 생성
```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE diary_service;

# 사용자 생성 (선택사항)
CREATE USER diary_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE diary_service TO diary_user;

# 종료
\q
```

### 2. 스키마 실행
```bash
cd diary-service
psql -U postgres -d diary_service -f database/schema.sql
```

## 백엔드 실행

### 1. 디렉토리 이동
```bash
cd diary-service/backend
```

### 2. application.yml 설정 확인
`src/main/resources/application.yml` 파일에서 데이터베이스 연결 정보를 확인하고 필요시 수정:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/diary_service
    username: postgres  # 또는 생성한 사용자명
    password: password  # 실제 비밀번호로 변경
```

### 3. 업로드 디렉토리 생성
```bash
mkdir -p uploads/images
```

### 4. 애플리케이션 실행
```bash
# Maven Wrapper 사용
./mvnw spring-boot:run

# 또는 Maven이 설치되어 있다면
mvn spring-boot:run
```

백엔드가 성공적으로 실행되면 `http://localhost:8080`에서 접근 가능합니다.

## 프론트엔드 실행

### 1. 새 터미널에서 디렉토리 이동
```bash
cd diary-service/frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 애플리케이션 실행
```bash
npm start
```

프론트엔드가 성공적으로 실행되면 `http://localhost:3000`에서 접근 가능합니다.

## 접속 및 사용

1. 웹 브라우저에서 `http://localhost:3000` 접속
2. 자동으로 임시 사용자 ID가 생성됩니다
3. 일기 작성, 수정, 삭제, 검색, 통계 기능을 사용할 수 있습니다

## 주요 기능

### 1. 일기 관리
- **일기 작성**: 제목, 내용, 사진(1장) 첨부 가능
- **일기 수정**: 기존 일기 내용 편집
- **일기 삭제**: 확인 메시지와 함께 삭제
- **일기 조회**: 카드 형태의 목록 및 상세 보기

### 2. 검색 기능
- **제목 검색**: 일기 제목으로 검색
- **내용 검색**: 일기 본문 내용으로 검색
- **날짜 검색**: 특정 기간의 일기 검색

### 3. 통계 기능
- **월별 통계**: 월별 일기 작성 횟수 차트
- **단어 분석**: 자주 사용하는 단어 상위 20개

### 4. 테마 지원
- **라이트 모드**: 밝은 노트북 스타일
- **다크 모드**: 어두운 테마 지원

## 문제 해결

### 1. 데이터베이스 연결 오류
- PostgreSQL 서비스가 실행 중인지 확인
- 데이터베이스 이름, 사용자명, 비밀번호 확인
- 방화벽 설정 확인

### 2. 포트 충돌
- 8080 포트(백엔드) 또는 3000 포트(프론트엔드)가 사용 중인 경우
- 다른 포트로 변경하거나 기존 프로세스 종료

### 3. 파일 업로드 오류
- `uploads/images` 디렉토리 존재 여부 확인
- 디렉토리 쓰기 권한 확인

### 4. 빌드 오류
```bash
# 백엔드 클린 빌드
cd backend
./mvnw clean install

# 프론트엔드 캐시 클리어
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 개발 모드

### 백엔드 개발 모드
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### 프론트엔드 개발 모드
```bash
cd frontend
npm start
```

개발 모드에서는 파일 변경 시 자동으로 재시작됩니다.

## 프로덕션 빌드

### 백엔드 빌드
```bash
cd backend
./mvnw clean package
java -jar target/diary-service-0.0.1-SNAPSHOT.jar
```

### 프론트엔드 빌드
```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/build` 디렉토리에 생성됩니다.

## 지원 및 문의

문제가 발생하거나 질문이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**즐거운 일기 작성 되세요! 📝**
