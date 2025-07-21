package com.diary.dto;

import java.util.List;
import java.util.Map;

public class StatisticsDTO {
    private List<MonthlyStatistic> monthlyStatistics;
    private List<WordFrequency> wordFrequencies;
    private long totalDiaries;
    
    public StatisticsDTO() {}
    
    public StatisticsDTO(List<MonthlyStatistic> monthlyStatistics, List<WordFrequency> wordFrequencies, long totalDiaries) {
        this.monthlyStatistics = monthlyStatistics;
        this.wordFrequencies = wordFrequencies;
        this.totalDiaries = totalDiaries;
    }
    
    // Getters and Setters
    public List<MonthlyStatistic> getMonthlyStatistics() {
        return monthlyStatistics;
    }
    
    public void setMonthlyStatistics(List<MonthlyStatistic> monthlyStatistics) {
        this.monthlyStatistics = monthlyStatistics;
    }
    
    public List<WordFrequency> getWordFrequencies() {
        return wordFrequencies;
    }
    
    public void setWordFrequencies(List<WordFrequency> wordFrequencies) {
        this.wordFrequencies = wordFrequencies;
    }
    
    public long getTotalDiaries() {
        return totalDiaries;
    }
    
    public void setTotalDiaries(long totalDiaries) {
        this.totalDiaries = totalDiaries;
    }
    
    // 내부 클래스들
    public static class MonthlyStatistic {
        private int year;
        private int month;
        private long count;
        
        public MonthlyStatistic() {}
        
        public MonthlyStatistic(int year, int month, long count) {
            this.year = year;
            this.month = month;
            this.count = count;
        }
        
        // Getters and Setters
        public int getYear() {
            return year;
        }
        
        public void setYear(int year) {
            this.year = year;
        }
        
        public int getMonth() {
            return month;
        }
        
        public void setMonth(int month) {
            this.month = month;
        }
        
        public long getCount() {
            return count;
        }
        
        public void setCount(long count) {
            this.count = count;
        }
    }
    
    public static class WordFrequency {
        private String word;
        private long frequency;
        
        public WordFrequency() {}
        
        public WordFrequency(String word, long frequency) {
            this.word = word;
            this.frequency = frequency;
        }
        
        // Getters and Setters
        public String getWord() {
            return word;
        }
        
        public void setWord(String word) {
            this.word = word;
        }
        
        public long getFrequency() {
            return frequency;
        }
        
        public void setFrequency(long frequency) {
            this.frequency = frequency;
        }
    }
}
