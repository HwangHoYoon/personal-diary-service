import styled from 'styled-components';

// 컨테이너
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`;

// 카드
export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.md};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${props => props.theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

// 버튼
export const Button = styled.button`
  background: ${props => props.variant === 'secondary' 
    ? props.theme.colors.secondary 
    : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' 
    ? props.theme.colors.text 
    : '#FFFFFF'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  ${props => props.size === 'large' && `
    padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
    font-size: 16px;
  `}

  ${props => props.size === 'small' && `
    padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
    font-size: 12px;
  `}
`;

// 입력 필드
export const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

// 텍스트 영역
export const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: ${props => props.theme.fonts.primary};
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

// 제목
export const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.secondary};
  font-size: ${props => {
    switch(props.level) {
      case 2: return '24px';
      case 3: return '20px';
      case 4: return '18px';
      default: return '28px';
    }
  }};
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.md};
  line-height: 1.3;
`;

// 텍스트
export const Text = styled.p`
  color: ${props => props.secondary 
    ? props.theme.colors.textSecondary 
    : props.theme.colors.text};
  font-size: ${props => props.size === 'small' ? '12px' : '14px'};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.sm};

  ${props => props.center && 'text-align: center;'}
`;

// 로딩 스피너
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${props => props.theme.spacing.lg} auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// 그리드
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
`;

// 플렉스 컨테이너
export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || props.theme.spacing.sm};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
  
  ${props => props.direction === 'column' && 'flex-direction: column;'}
`;

// 구분선
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: ${props => props.theme.spacing.lg} 0;
`;
