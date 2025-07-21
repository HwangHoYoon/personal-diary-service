import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { userAPI } from './services/api';

// Components
import Header from './components/Header';
import DiaryList from './components/DiaryList';
import DiaryForm from './components/DiaryForm';
import DiaryDetail from './components/DiaryDetail';
import Search from './components/Search';
import Statistics from './components/Statistics';
import { LoadingSpinner, Container } from './components/common/StyledComponents';

const GlobalStyle = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.primary};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.main`
  padding: ${props => props.theme.spacing.lg} 0;
  min-height: calc(100vh - 80px);
`;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // 다크모드 설정 로드
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }

      // 임시 ID 확인 및 생성
      let tempId = localStorage.getItem('tempId');
      
      if (tempId) {
        // 기존 임시 ID 검증
        try {
          await userAPI.validateTempId(tempId);
        } catch (error) {
          // 유효하지 않은 임시 ID인 경우 새로 생성
          tempId = null;
        }
      }
      
      if (!tempId) {
        // 새 임시 사용자 생성
        const response = await userAPI.createTempUser();
        tempId = response.data.tempId;
        localStorage.setItem('tempId', tempId);
      }

    } catch (error) {
      console.error('앱 초기화 실패:', error);
    } finally {
      setIsInitialized(true);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  if (!isInitialized) {
    return (
      <ThemeProvider theme={lightTheme}>
        <GlobalStyle>
          <Container>
            <LoadingSpinner />
          </Container>
        </GlobalStyle>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle>
        <Router>
          <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          <MainContent>
            <Routes>
              <Route path="/" element={<DiaryList />} />
              <Route path="/write" element={<DiaryForm />} />
              <Route path="/edit/:id" element={<DiaryForm />} />
              <Route path="/diary/:id" element={<DiaryDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </MainContent>
        </Router>
      </GlobalStyle>
    </ThemeProvider>
  );
};

export default App;
