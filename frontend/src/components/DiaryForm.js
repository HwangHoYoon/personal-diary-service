import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FiSave, FiX, FiImage, FiTrash2 } from 'react-icons/fi';
import { diaryAPI, fileAPI } from '../services/api';
import {
  Container,
  Card,
  Title,
  Input,
  TextArea,
  Button,
  LoadingSpinner,
  Flex,
  Text
} from './common/StyledComponents';

const FormCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ImageUpload = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  input {
    display: none;
  }
`;

const ImagePreview = styled.div`
  position: relative;
  margin-top: ${props => props.theme.spacing.md};
  
  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: ${props => props.theme.borderRadius.md};
  }
`;

const RemoveImageButton = styled(Button)`
  position: absolute;
  top: ${props => props.theme.spacing.sm};
  right: ${props => props.theme.spacing.sm};
  background: rgba(244, 67, 54, 0.9);
  color: white;
  padding: ${props => props.theme.spacing.xs};
  border-radius: 50%;
`;

const ActionButtons = styled(Flex)`
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`;

const ErrorMessage = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  margin-top: ${props => props.theme.spacing.xs};
`;

const DiaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    diaryDate: format(new Date(), 'yyyy-MM-dd'),
    imagePath: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      loadDiary();
    }
  }, [id, isEdit]);

  const loadDiary = async () => {
    try {
      setLoading(true);
      const response = await diaryAPI.getDiary(id);
      const diary = response.data;
      
      setFormData({
        title: diary.title,
        content: diary.content,
        diaryDate: diary.diaryDate,
        imagePath: diary.imagePath || ''
      });

      if (diary.imagePath) {
        setImagePreview(fileAPI.getFileUrl(diary.imagePath));
      }
    } catch (error) {
      console.error('일기 로딩 실패:', error);
      alert('일기를 불러오는데 실패했습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, GIF 파일만 업로드 가능합니다.');
      return;
    }

    setImageFile(file);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      imagePath: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      let imagePath = formData.imagePath;
      
      // 새 이미지가 있으면 업로드
      if (imageFile) {
        const uploadResponse = await fileAPI.uploadFile(imageFile);
        imagePath = uploadResponse.data.filename;
      }

      const diaryData = {
        ...formData,
        imagePath
      };

      if (isEdit) {
        await diaryAPI.updateDiary(id, diaryData);
        alert('일기가 수정되었습니다.');
      } else {
        await diaryAPI.createDiary(diaryData);
        alert('일기가 작성되었습니다.');
      }

      navigate('/');
    } catch (error) {
      console.error('일기 저장 실패:', error);
      alert('일기 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <FormCard>
        <Title>{isEdit ? '일기 수정' : '새 일기 작성'}</Title>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="일기 제목을 입력하세요"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="diaryDate">날짜</Label>
            <Input
              id="diaryDate"
              name="diaryDate"
              type="date"
              value={formData.diaryDate}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>사진 (선택사항)</Label>
            <ImageUpload onClick={() => document.getElementById('imageInput').click()}>
              <input
                id="imageInput"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
              />
              <FiImage size={48} color="#ccc" />
              <Text>클릭하여 사진을 업로드하세요</Text>
              <Text size="small" secondary>JPG, PNG, GIF (최대 5MB)</Text>
            </ImageUpload>
            
            {imagePreview && (
              <ImagePreview>
                <img src={imagePreview} alt="미리보기" />
                <RemoveImageButton type="button" onClick={removeImage}>
                  <FiTrash2 size={16} />
                </RemoveImageButton>
              </ImagePreview>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">내용</Label>
            <TextArea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="오늘 하루는 어땠나요?"
            />
            {errors.content && <ErrorMessage>{errors.content}</ErrorMessage>}
          </FormGroup>

          <ActionButtons>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              <FiX size={16} />
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              <FiSave size={16} />
              {loading ? '저장 중...' : (isEdit ? '수정' : '저장')}
            </Button>
          </ActionButtons>
        </form>
      </FormCard>
    </Container>
  );
};

export default DiaryForm;
