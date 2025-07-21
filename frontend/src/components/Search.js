import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FiSearch, FiCalendar, FiEdit, FiTrash2 } from 'react-icons/fi';
import { diaryAPI, fileAPI } from '../services/api';
import {
  Container,
  Card,
  Title,
  Input,
  Button,
  LoadingSpinner,
  Grid,
  Flex,
  Text
} from './common/StyledComponents';

const SearchCard = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${props => props.theme.spacing.md};
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 14px;
`;

const SearchTabs = styled(Flex)`
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TabButton = styled(Button)`
  background: transparent;
  color: ${props => props.active 
    ? props.theme.colors.primary 
    : props.theme.colors.textSecondary};
  border: none;
  border-bottom: 2px solid ${props => props.active 
    ? props.theme.colors.primary 
    : 'transparent'};
  border-radius: 0;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};

  &:hover {
    background: ${props => props.theme.colors.border};
    transform: none;
  }
`;

const ResultCard = styled(Card)`
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ResultImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ResultTitle = styled(Title)`
  font-size: 16px;
  margin-bottom: ${props => props.theme.spacing.xs};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ResultContent = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ResultMeta = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

const DateInfo = styled(Flex)`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
`;

const ActionButtons = styled(Flex)`
  gap: ${props => props.theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: ${props => props.theme.spacing.xs};
  font-size: 12px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const Search = () => {
  const [searchType, setSearchType] = useState('title'); // title, content, date
  const [searchParams, setSearchParams] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    let params = {};
    
    switch (searchType) {
      case 'title':
        if (!searchParams.title.trim()) {
          alert('검색할 제목을 입력해주세요.');
          return;
        }
        params.title = searchParams.title;
        break;
      case 'content':
        if (!searchParams.content.trim()) {
          alert('검색할 내용을 입력해주세요.');
          return;
        }
        params.content = searchParams.content;
        break;
      case 'date':
        if (!searchParams.startDate || !searchParams.endDate) {
          alert('검색할 날짜 범위를 선택해주세요.');
          return;
        }
        params.startDate = searchParams.startDate;
        params.endDate = searchParams.endDate;
        break;
    }

    try {
      setLoading(true);
      const response = await diaryAPI.searchDiaries(params);
      setResults(response.data.content);
      setHasSearched(true);
    } catch (error) {
      console.error('검색 실패:', error);
      alert('검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, diaryId) => {
    e.stopPropagation();
    
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      try {
        await diaryAPI.deleteDiary(diaryId);
        setResults(results.filter(diary => diary.id !== diaryId));
      } catch (error) {
        console.error('일기 삭제 실패:', error);
        alert('일기 삭제에 실패했습니다.');
      }
    }
  };

  const handleEdit = (e, diaryId) => {
    e.stopPropagation();
    navigate(`/edit/${diaryId}`);
  };

  const handleCardClick = (diaryId) => {
    navigate(`/diary/${diaryId}`);
  };

  const renderSearchForm = () => {
    switch (searchType) {
      case 'title':
        return (
          <FormGroup>
            <Label>제목</Label>
            <Input
              name="title"
              type="text"
              value={searchParams.title}
              onChange={handleInputChange}
              placeholder="검색할 제목을 입력하세요"
            />
          </FormGroup>
        );
      case 'content':
        return (
          <FormGroup>
            <Label>내용</Label>
            <Input
              name="content"
              type="text"
              value={searchParams.content}
              onChange={handleInputChange}
              placeholder="검색할 내용을 입력하세요"
            />
          </FormGroup>
        );
      case 'date':
        return (
          <>
            <FormGroup>
              <Label>시작 날짜</Label>
              <Input
                name="startDate"
                type="date"
                value={searchParams.startDate}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>종료 날짜</Label>
              <Input
                name="endDate"
                type="date"
                value={searchParams.endDate}
                onChange={handleInputChange}
              />
            </FormGroup>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>일기 검색</Title>
      
      <SearchCard>
        <SearchTabs>
          <TabButton
            active={searchType === 'title'}
            onClick={() => setSearchType('title')}
          >
            제목 검색
          </TabButton>
          <TabButton
            active={searchType === 'content'}
            onClick={() => setSearchType('content')}
          >
            내용 검색
          </TabButton>
          <TabButton
            active={searchType === 'date'}
            onClick={() => setSearchType('date')}
          >
            날짜 검색
          </TabButton>
        </SearchTabs>

        <SearchForm onSubmit={handleSearch}>
          {renderSearchForm()}
          <Button type="submit" disabled={loading}>
            <FiSearch size={16} />
            {loading ? '검색 중...' : '검색'}
          </Button>
        </SearchForm>
      </SearchCard>

      {loading && <LoadingSpinner />}

      {hasSearched && !loading && (
        <>
          <Title level={2}>검색 결과 ({results.length}개)</Title>
          
          {results.length === 0 ? (
            <EmptyState>
              <Text>검색 결과가 없습니다.</Text>
            </EmptyState>
          ) : (
            <Grid>
              {results.map((diary) => (
                <ResultCard 
                  key={diary.id} 
                  onClick={() => handleCardClick(diary.id)}
                >
                  {diary.imagePath && (
                    <ResultImage 
                      src={fileAPI.getFileUrl(diary.imagePath)} 
                      alt="일기 이미지"
                    />
                  )}
                  
                  <ResultTitle level={3}>{diary.title}</ResultTitle>
                  <ResultContent>{diary.content}</ResultContent>
                  
                  <ResultMeta>
                    <DateInfo>
                      <FiCalendar size={14} />
                      {format(new Date(diary.diaryDate), 'yyyy년 MM월 dd일', { locale: ko })}
                    </DateInfo>
                    
                    <ActionButtons>
                      <ActionButton
                        size="small"
                        variant="secondary"
                        onClick={(e) => handleEdit(e, diary.id)}
                      >
                        <FiEdit size={12} />
                        수정
                      </ActionButton>
                      <ActionButton
                        size="small"
                        onClick={(e) => handleDelete(e, diary.id)}
                        style={{ background: '#F44336' }}
                      >
                        <FiTrash2 size={12} />
                        삭제
                      </ActionButton>
                    </ActionButtons>
                  </ResultMeta>
                </ResultCard>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Search;
