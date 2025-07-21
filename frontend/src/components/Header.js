import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiSun, FiMoon, FiBook, FiBarChart3, FiSearch, FiPlus } from 'react-icons/fi';
import { Container, Button, Flex } from './common/StyledComponents';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  cursor: pointer;
  
  h1 {
    color: ${props => props.theme.colors.primary};
    font-family: ${props => props.theme.fonts.secondary};
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const NavButton = styled(Button)`
  background: ${props => props.active 
    ? props.theme.colors.primary 
    : 'transparent'};
  color: ${props => props.active 
    ? '#FFFFFF' 
    : props.theme.colors.text};
  border: 1px solid ${props => props.active 
    ? props.theme.colors.primary 
    : props.theme.colors.border};

  &:hover {
    background: ${props => props.active 
      ? props.theme.colors.primary 
      : props.theme.colors.border};
    color: ${props => props.active 
      ? '#FFFFFF' 
      : props.theme.colors.text};
  }
`;

const ThemeToggle = styled(Button)`
  background: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.sm};
  
  &:hover {
    background: ${props => props.theme.colors.border};
  }
`;

const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo onClick={() => navigate('/')}>
          <FiBook size={28} />
          <h1>My Diary</h1>
        </Logo>

        <Nav>
          <NavButton
            active={isActive('/')}
            onClick={() => navigate('/')}
          >
            <FiBook size={16} />
            일기 목록
          </NavButton>

          <NavButton
            active={isActive('/write')}
            onClick={() => navigate('/write')}
          >
            <FiPlus size={16} />
            일기 쓰기
          </NavButton>

          <NavButton
            active={isActive('/search')}
            onClick={() => navigate('/search')}
          >
            <FiSearch size={16} />
            검색
          </NavButton>

          <NavButton
            active={isActive('/statistics')}
            onClick={() => navigate('/statistics')}
          >
            <FiBarChart3 size={16} />
            통계
          </NavButton>

          <ThemeToggle onClick={toggleTheme}>
            {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          </ThemeToggle>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
