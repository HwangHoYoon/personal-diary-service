package com.diary.service;

import com.diary.dto.DiaryDTO;
import com.diary.entity.Diary;
import com.diary.entity.User;
import com.diary.repository.DiaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class DiaryService {
    
    @Autowired
    private DiaryRepository diaryRepository;
    
    /**
     * 일기 목록 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<DiaryDTO> getDiaries(User user, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Diary> diaries = diaryRepository.findByUserOrderByDiaryDateDesc(user, pageable);
        return diaries.map(DiaryDTO::new);
    }
    
    /**
     * 일기 상세 조회
     */
    @Transactional(readOnly = true)
    public Optional<DiaryDTO> getDiary(User user, Long diaryId) {
        Optional<Diary> diary = diaryRepository.findByIdAndUser(diaryId, user);
        return diary.map(DiaryDTO::new);
    }
    
    /**
     * 일기 작성
     */
    public DiaryDTO createDiary(User user, DiaryDTO diaryDTO) {
        Diary diary = new Diary(user, diaryDTO.getTitle(), diaryDTO.getContent());
        
        // 날짜가 지정되지 않은 경우 오늘 날짜로 설정
        if (diaryDTO.getDiaryDate() != null) {
            diary.setDiaryDate(diaryDTO.getDiaryDate());
        }
        
        if (diaryDTO.getImagePath() != null) {
            diary.setImagePath(diaryDTO.getImagePath());
        }
        
        Diary savedDiary = diaryRepository.save(diary);
        return new DiaryDTO(savedDiary);
    }
    
    /**
     * 일기 수정
     */
    public Optional<DiaryDTO> updateDiary(User user, Long diaryId, DiaryDTO diaryDTO) {
        Optional<Diary> optionalDiary = diaryRepository.findByIdAndUser(diaryId, user);
        
        if (optionalDiary.isPresent()) {
            Diary diary = optionalDiary.get();
            diary.setTitle(diaryDTO.getTitle());
            diary.setContent(diaryDTO.getContent());
            
            if (diaryDTO.getDiaryDate() != null) {
                diary.setDiaryDate(diaryDTO.getDiaryDate());
            }
            
            if (diaryDTO.getImagePath() != null) {
                diary.setImagePath(diaryDTO.getImagePath());
            }
            
            diary.preUpdate(); // 업데이트 시간 갱신
            Diary updatedDiary = diaryRepository.save(diary);
            return Optional.of(new DiaryDTO(updatedDiary));
        }
        
        return Optional.empty();
    }
    
    /**
     * 일기 삭제
     */
    public boolean deleteDiary(User user, Long diaryId) {
        Optional<Diary> diary = diaryRepository.findByIdAndUser(diaryId, user);
        
        if (diary.isPresent()) {
            diaryRepository.delete(diary.get());
            return true;
        }
        
        return false;
    }
    
    /**
     * 일기 검색 - 제목
     */
    @Transactional(readOnly = true)
    public Page<DiaryDTO> searchByTitle(User user, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Diary> diaries = diaryRepository.findByUserAndTitleContainingIgnoreCase(user, keyword, pageable);
        return diaries.map(DiaryDTO::new);
    }
    
    /**
     * 일기 검색 - 내용
     */
    @Transactional(readOnly = true)
    public Page<DiaryDTO> searchByContent(User user, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Diary> diaries = diaryRepository.findByUserAndContentContainingIgnoreCase(user, keyword, pageable);
        return diaries.map(DiaryDTO::new);
    }
    
    /**
     * 일기 검색 - 날짜 범위
     */
    @Transactional(readOnly = true)
    public Page<DiaryDTO> searchByDateRange(User user, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Diary> diaries = diaryRepository.findByUserAndDiaryDateBetweenOrderByDiaryDateDesc(user, startDate, endDate, pageable);
        return diaries.map(DiaryDTO::new);
    }
    
    /**
     * 사용자의 총 일기 수 조회
     */
    @Transactional(readOnly = true)
    public long getTotalDiaryCount(User user) {
        return diaryRepository.countByUser(user);
    }
}
