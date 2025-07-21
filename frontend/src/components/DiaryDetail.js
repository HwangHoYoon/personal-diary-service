import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FiEdit, FiTrash2, FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { diaryAPI, fileAPI } from '../services/api';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  LoadingSpinner,
  Flex
} from './common/StyledComponents';

const DetailCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const DiaryImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DiaryHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const DiaryTitle = styled(Title)`
  margin-bottom: ${props => props.theme.spacing.md};
`;

const DiaryMeta = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const DateInfo = styled(Flex)`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`;

const ActionButtons = styled(Flex)`
  gap: ${props => props.theme.spacing.sm};
`;

const DiaryContent = styled.div`
  line-height: 1.8;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const BackButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diary, setDiary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiary();
  }, [id]);

  const loadDiary = async () => {
    try {
      setLoading(true);
      const response = await diaryAPI.getDiary(id);
      setDiary(response.data);
    } catch (error) {
      console.error('일기 로딩 실패:', error);
      alert('일기를 불러오는데 실패했습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      try {
        await diaryAPI.deleteDiary(id);
        alert('일기가 삭제되었습니다.');
        navigate('/');
      } catch (error) {
        console.error('일기 삭제 실패:', error);
        alert('일기 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (!diary) {
    return (
      <Container>
        <Text>일기를 찾을 수 없습니다.</Text>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>
        <FiArrowLeft size={16} />
        목록으로 돌아가기
      </BackButton>

      <DetailCard>
        <DiaryHeader>
          <DiaryTitle>{diary.title}</DiaryTitle>
          
          <DiaryMeta>
            <DateInfo>
              <FiCalendar size={16} />
              {format(new Date(diary.diaryDate), 'yyyy년 MM월 dd일 (EEEE)', { locale: ko })}
            </DateInfo>
            
            <ActionButtons>
              <Button variant="secondary" onClick={handleEdit}>
                <FiEdit size={16} />
                수정
              </Button>
              <Button 
                onClick={handleDelete}
                style={{ background: '#F44336' }}
              >
                <FiTrash2 size={16} />
                삭제
              </Button>
            </ActionButtons>
          </DiaryMeta>
        </DiaryHeader>

        {diary.imagePath && (
          <DiaryImage 
            src={fileAPI.getFileUrl(diary.imagePath)} 
            alt="일기 이미지"
          />
        )}

        <DiaryContent>
          {diary.content}
        </DiaryContent>

        <Flex justify="space-between" style={{ fontSize: '12px', color: '#999' }}>
          <Text size="small" secondary>
            작성일: {format(new Date(diary.createdAt), 'yyyy-MM-dd HH:mm')}
          </Text>
          {diary.updatedAt !== diary.createdAt && (
            <Text size="small" secondary>
              수정일: {format(new Date(diary.updatedAt), 'yyyy-MM-dd HH:mm')}
            </Text>
          )}
        </Flex>
      </DetailCard>
    </Container>
  );
};

export default DiaryDetail;
