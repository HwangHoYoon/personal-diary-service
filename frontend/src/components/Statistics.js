import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiBarChart3, FiType, FiBook } from 'react-icons/fi';
import { statisticsAPI } from '../services/api';
import {
  Container,
  Card,
  Title,
  Text,
  LoadingSpinner,
  Grid,
  Flex
} from './common/StyledComponents';

const StatCard = styled(Card)`
  text-align: center;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${props => props.theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled(Text)`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin: 0;
`;

const ChartCard = styled(Card)`
  grid-column: 1 / -1;
`;

const WordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const WordItem = styled(Flex)`
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
`;

const WordText = styled(Text)`
  margin: 0;
  font-weight: 500;
`;

const WordCount = styled(Text)`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await statisticsAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('통계 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (monthlyStats) => {
    return monthlyStats.map(stat => ({
      month: `${stat.year}-${String(stat.month).padStart(2, '0')}`,
      count: stat.count,
      displayMonth: `${stat.year}년 ${stat.month}월`
    }));
  };

  const getTotalMonthlyCount = () => {
    if (!statistics?.monthlyStatistics) return 0;
    return statistics.monthlyStatistics.reduce((total, stat) => total + stat.count, 0);
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (!statistics) {
    return (
      <Container>
        <EmptyState>
          <Text>통계 데이터를 불러올 수 없습니다.</Text>
        </EmptyState>
      </Container>
    );
  }

  const chartData = formatChartData(statistics.monthlyStatistics);

  return (
    <Container>
      <Title>일기 통계</Title>
      
      <Grid>
        <StatCard>
          <StatIcon>
            <FiBook size={24} />
          </StatIcon>
          <StatValue>{statistics.totalDiaries}</StatValue>
          <StatLabel>총 일기 수</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FiBarChart3 size={24} />
          </StatIcon>
          <StatValue>{statistics.monthlyStatistics.length}</StatValue>
          <StatLabel>활동 개월 수</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon>
            <FiType size={24} />
          </StatIcon>
          <StatValue>{statistics.wordFrequencies.length}</StatValue>
          <StatLabel>고유 단어 수</StatLabel>
        </StatCard>
      </Grid>

      {chartData.length > 0 && (
        <ChartCard>
          <Title level={2}>월별 일기 작성 통계</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${year.slice(2)}/${month}`;
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [value, '일기 수']}
                labelFormatter={(label) => {
                  const stat = chartData.find(item => item.month === label);
                  return stat ? stat.displayMonth : label;
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#8B4513" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {statistics.wordFrequencies.length > 0 && (
        <Card>
          <Title level={2}>자주 쓰는 단어 (상위 20개)</Title>
          <WordGrid>
            {statistics.wordFrequencies.map((word, index) => (
              <WordItem key={index}>
                <WordText>{word.word}</WordText>
                <WordCount>{word.frequency}회</WordCount>
              </WordItem>
            ))}
          </WordGrid>
        </Card>
      )}

      {statistics.totalDiaries === 0 && (
        <EmptyState>
          <Text>아직 작성된 일기가 없습니다.</Text>
          <Text secondary>일기를 작성하면 통계를 확인할 수 있습니다.</Text>
        </EmptyState>
      )}
    </Container>
  );
};

export default Statistics;
