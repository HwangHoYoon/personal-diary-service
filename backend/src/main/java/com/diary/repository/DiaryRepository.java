package com.diary.repository;

import com.diary.entity.Diary;
import com.diary.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    
    // 사용자별 일기 조회
    Page<Diary> findByUserOrderByDiaryDateDesc(User user, Pageable pageable);
    
    // 사용자별 일기 개수
    long countByUser(User user);
    
    // 특정 사용자의 특정 일기 조회
    Optional<Diary> findByIdAndUser(Long id, User user);
    
    // 제목으로 검색
    @Query("SELECT d FROM Diary d WHERE d.user = :user AND LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.diaryDate DESC")
    Page<Diary> findByUserAndTitleContainingIgnoreCase(@Param("user") User user, @Param("keyword") String keyword, Pageable pageable);
    
    // 내용으로 검색
    @Query("SELECT d FROM Diary d WHERE d.user = :user AND LOWER(d.content) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY d.diaryDate DESC")
    Page<Diary> findByUserAndContentContainingIgnoreCase(@Param("user") User user, @Param("keyword") String keyword, Pageable pageable);
    
    // 날짜 범위로 검색
    Page<Diary> findByUserAndDiaryDateBetweenOrderByDiaryDateDesc(User user, LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    // 특정 날짜의 일기 조회
    List<Diary> findByUserAndDiaryDate(User user, LocalDate date);
    
    // 월별 통계를 위한 쿼리
    @Query("SELECT EXTRACT(YEAR FROM d.diaryDate) as year, EXTRACT(MONTH FROM d.diaryDate) as month, COUNT(d) as count " +
           "FROM Diary d WHERE d.user = :user " +
           "GROUP BY EXTRACT(YEAR FROM d.diaryDate), EXTRACT(MONTH FROM d.diaryDate) " +
           "ORDER BY year DESC, month DESC")
    List<Object[]> getMonthlyStatistics(@Param("user") User user);
    
    // 자주 쓰는 단어 분석을 위한 모든 내용 조회
    @Query("SELECT d.content FROM Diary d WHERE d.user = :user")
    List<String> findAllContentByUser(@Param("user") User user);
}
