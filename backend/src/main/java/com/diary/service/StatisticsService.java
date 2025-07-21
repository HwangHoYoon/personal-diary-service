package com.diary.service;

import com.diary.dto.StatisticsDTO;
import com.diary.entity.User;
import com.diary.repository.DiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StatisticsService {
    
    @Autowired
    private DiaryRepository diaryRepository;
    
    /**
     * 사용자 통계 조회
     */
    public StatisticsDTO getUserStatistics(User user) {
        // 월별 통계
        List<StatisticsDTO.MonthlyStatistic> monthlyStats = getMonthlyStatistics(user);
        
        // 자주 쓰는 단어 통계
        List<StatisticsDTO.WordFrequency> wordFrequencies = getWordFrequencies(user);
        
        // 총 일기 수
        long totalDiaries = diaryRepository.countByUser(user);
        
        return new StatisticsDTO(monthlyStats, wordFrequencies, totalDiaries);
    }
    
    /**
     * 월별 일기 작성 통계
     */
    private List<StatisticsDTO.MonthlyStatistic> getMonthlyStatistics(User user) {
        List<Object[]> results = diaryRepository.getMonthlyStatistics(user);
        
        return results.stream()
                .map(result -> {
                    // PostgreSQL에서 EXTRACT 결과는 BigDecimal로 반환됨
                    int year = ((BigDecimal) result[0]).intValue();
                    int month = ((BigDecimal) result[1]).intValue();
                    long count = ((Number) result[2]).longValue();
                    
                    return new StatisticsDTO.MonthlyStatistic(year, month, count);
                })
                .collect(Collectors.toList());
    }
    
    /**
     * 자주 쓰는 단어 분석
     */
    private List<StatisticsDTO.WordFrequency> getWordFrequencies(User user) {
        List<String> contents = diaryRepository.findAllContentByUser(user);
        
        // 모든 내용을 합치고 단어 분석
        String allContent = String.join(" ", contents);
        
        // 간단한 단어 분석 (실제로는 더 정교한 형태소 분석이 필요)
        Map<String, Long> wordCount = Arrays.stream(allContent.split("\\s+"))
                .filter(word -> word.length() > 1) // 1글자 단어 제외
                .filter(word -> !isStopWord(word)) // 불용어 제외
                .collect(Collectors.groupingBy(
                        String::toLowerCase,
                        Collectors.counting()
                ));
        
        // 빈도순으로 정렬하여 상위 20개 반환
        return wordCount.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(20)
                .map(entry -> new StatisticsDTO.WordFrequency(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }
    
    /**
     * 불용어 체크 (간단한 버전)
     */
    private boolean isStopWord(String word) {
        Set<String> stopWords = Set.of(
                "이", "그", "저", "것", "들", "는", "은", "을", "를", "에", "의", "가", "와", "과",
                "도", "만", "까지", "부터", "로", "으로", "에서", "에게", "한테", "하고", "그리고",
                "또", "또한", "그런데", "하지만", "그러나", "그래서", "따라서", "즉", "예를", "들어",
                "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"
        );
        
        return stopWords.contains(word.toLowerCase()) || word.matches("\\d+") || word.matches("[^\\w가-힣]");
    }
}
