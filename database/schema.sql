-- Personal Diary Service Database Schema

-- 사용자 테이블 (임시 ID 기반)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    temp_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 일기 테이블
CREATE TABLE diaries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    diary_date DATE NOT NULL,
    image_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_diaries_user_id ON diaries(user_id);
CREATE INDEX idx_diaries_date ON diaries(diary_date);
CREATE INDEX idx_diaries_title ON diaries(title);
CREATE INDEX idx_users_temp_id ON users(temp_id);

-- 전문 검색을 위한 인덱스 (PostgreSQL의 GIN 인덱스 사용)
CREATE INDEX idx_diaries_content_search ON diaries USING gin(to_tsvector('korean', content));
CREATE INDEX idx_diaries_title_search ON diaries USING gin(to_tsvector('korean', title));

-- 샘플 데이터 (테스트용)
INSERT INTO users (temp_id) VALUES ('temp_user_001');

INSERT INTO diaries (user_id, title, content, diary_date) VALUES 
(1, '첫 번째 일기', '오늘은 새로운 일기장 서비스를 시작했다. 정말 기대된다!', '2025-07-21'),
(1, '두 번째 일기', '일기 쓰는 습관을 만들어보자. 매일 조금씩이라도 기록하는 것이 중요하다.', '2025-07-20');
