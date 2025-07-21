import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 임시 ID 헤더 추가
api.interceptors.request.use((config) => {
  const tempId = localStorage.getItem('tempId');
  if (tempId) {
    config.headers['X-Temp-Id'] = tempId;
  }
  return config;
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 사용자 관련 API
export const userAPI = {
  // 임시 사용자 생성
  createTempUser: () => api.post('/users/temp'),
  
  // 임시 ID 검증
  validateTempId: (tempId) => api.get(`/users/validate/${tempId}`),
};

// 일기 관련 API
export const diaryAPI = {
  // 일기 목록 조회
  getDiaries: (page = 0, size = 10) => 
    api.get('/diaries', { params: { page, size } }),
  
  // 일기 상세 조회
  getDiary: (id) => api.get(`/diaries/${id}`),
  
  // 일기 작성
  createDiary: (diary) => api.post('/diaries', diary),
  
  // 일기 수정
  updateDiary: (id, diary) => api.put(`/diaries/${id}`, diary),
  
  // 일기 삭제
  deleteDiary: (id) => api.delete(`/diaries/${id}`),
  
  // 일기 검색
  searchDiaries: (params) => api.get('/diaries/search', { params }),
};

// 파일 관련 API
export const fileAPI = {
  // 파일 업로드
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 파일 URL 생성
  getFileUrl: (filename) => `${API_BASE_URL}/files/${filename}`,
};

// 통계 관련 API
export const statisticsAPI = {
  // 통계 조회
  getStatistics: () => api.get('/statistics'),
};

export default api;
