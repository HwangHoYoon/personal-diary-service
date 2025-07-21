# GitHub 레포지토리 설정 가이드

## 1. GitHub에서 새 레포지토리 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 레포지토리 정보 입력:
   - **Repository name**: `personal-diary-service` (또는 원하는 이름)
   - **Description**: `개인 일기장 서비스 - Spring Boot + React + PostgreSQL`
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않음 (이미 로컬에 코드가 있으므로)
4. "Create repository" 버튼 클릭

## 2. 로컬 Git과 GitHub 연결

레포지토리 생성 후 GitHub에서 제공하는 명령어를 사용하거나, 아래 명령어를 실행:

```bash
# diary-service 디렉토리에서 실행
cd /mnt/c/Users/hyhwang/diary-service

# GitHub 레포지토리를 원격 저장소로 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/personal-diary-service.git

# 기본 브랜치를 main으로 변경 (선택사항)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 3. 실행 명령어 (참고용)

현재 준비된 명령어들:

```bash
# 원격 저장소 추가 (사용자명 변경 필요)
git remote add origin https://github.com/hyhwang/personal-diary-service.git

# 브랜치명 변경
git branch -M main

# 첫 번째 푸시
git push -u origin main
```

## 4. 인증 방법

### Personal Access Token 사용 (권장)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 필요한 권한 선택 (repo 권한 필수)
4. 토큰 생성 후 복사
5. Git 명령어 실행 시 비밀번호 대신 토큰 사용

### SSH 키 사용
1. SSH 키 생성: `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
2. GitHub → Settings → SSH and GPG keys → New SSH key
3. 공개키 내용 추가
4. 원격 저장소 URL을 SSH 형식으로 변경:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/personal-diary-service.git
   ```

## 5. 푸시 후 확인사항

푸시가 완료되면 GitHub 레포지토리에서 다음을 확인:
- [ ] 모든 소스 파일이 업로드되었는지
- [ ] README.md가 제대로 표시되는지
- [ ] .gitignore가 적용되어 불필요한 파일이 제외되었는지

## 6. 추가 설정 (선택사항)

### GitHub Pages 설정 (프론트엔드 배포용)
1. 레포지토리 → Settings → Pages
2. Source를 "GitHub Actions" 선택
3. React 앱 배포용 워크플로우 설정

### Issues 및 Wiki 활성화
1. 레포지토리 → Settings → General
2. Features 섹션에서 Issues, Wiki 등 활성화

---

**참고**: 실제 GitHub 사용자명으로 명령어의 `YOUR_USERNAME` 부분을 변경해주세요.
