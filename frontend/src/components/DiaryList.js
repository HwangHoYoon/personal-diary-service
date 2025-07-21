import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FiEdit, FiTrash2, FiImage, FiCalendar } from 'react-icons/fi';
import { diaryAPI, fileAPI } from '../services/api';
import { 
  Container, 
  Card, 
  Title, 
  Text, 
  Button, 
  LoadingSpinner, 
  Grid,
  Flex 
} from './common/StyledComponents';

const DiaryCard = styled(Card)`
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const DiaryImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const DiaryTitle = styled(Title)`
  font-size: 18px;
  margin-bottom: ${props => props.theme.spacing.sm};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DiaryContent = styled(Text)`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.5;
`;

const DiaryMeta = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
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

const Pagination = styled(Flex)`
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xl};
`;

const PageButton = styled(Button)`
  ${props => props.active && `
    background: ${props.theme.colors.primary};
    color: #FFFFFF;
  `}
`;

const DiaryList = () => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadDiaries();
  }, [currentPage]);

  const loadDiaries = async () => {
    try {
      setLoading(true);
      const response = await diaryAPI.getDiaries(currentPage, 9);
      setDiaries(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('일기 목록 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, diaryId) => {
    e.stopPropagation();
    
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      try {
        await diaryAPI.deleteDiary(diaryId);
        loadDiaries();
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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PageButton
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </PageButton>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <Title>내 일기</Title>
      
      {diaries.length === 0 ? (
        <EmptyState>
          <Text>아직 작성된 일기가 없습니다.</Text>
          <Button onClick={() => navigate('/write')}>
            첫 번째 일기 쓰기
          </Button>
        </EmptyState>
      ) : (
        <>
          <Grid>
            {diaries.map((diary) => (
              <DiaryCard 
                key={diary.id} 
                onClick={() => handleCardClick(diary.id)}
              >
                {diary.imagePath && (
                  <DiaryImage 
                    src={fileAPI.getFileUrl(diary.imagePath)} 
                    alt="일기 이미지"
                  />
                )}
                
                <DiaryTitle level={3}>{diary.title}</DiaryTitle>
                <DiaryContent>{diary.content}</DiaryContent>
                
                <DiaryMeta>
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
                </DiaryMeta>
              </DiaryCard>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Pagination>
              <Button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                이전
              </Button>
              
              {renderPagination()}
              
              <Button
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                다음
              </Button>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default DiaryList;
