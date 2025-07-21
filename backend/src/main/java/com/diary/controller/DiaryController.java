package com.diary.controller;

import com.diary.dto.DiaryDTO;
import com.diary.entity.User;
import com.diary.service.DiaryService;
import com.diary.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/diaries")
@CrossOrigin(origins = "http://localhost:3000")
public class DiaryController {
    
    @Autowired
    private DiaryService diaryService;
    
    @Autowired
    private UserService userService;
    
    /**
     * 일기 목록 조회
     */
    @GetMapping
    public ResponseEntity<Page<DiaryDTO>> getDiaries(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        User user = userService.getOrCreateUser(tempId);
        Page<DiaryDTO> diaries = diaryService.getDiaries(user, page, size);
        
        return ResponseEntity.ok(diaries);
    }
    
    /**
     * 일기 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiaryDTO> getDiary(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId,
            @PathVariable Long id) {
        
        User user = userService.getOrCreateUser(tempId);
        Optional<DiaryDTO> diary = diaryService.getDiary(user, id);
        
        return diary.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 일기 작성
     */
    @PostMapping
    public ResponseEntity<DiaryDTO> createDiary(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId,
            @Valid @RequestBody DiaryDTO diaryDTO) {
        
        User user = userService.getOrCreateUser(tempId);
        DiaryDTO createdDiary = diaryService.createDiary(user, diaryDTO);
        
        return ResponseEntity.ok(createdDiary);
    }
    
    /**
     * 일기 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<DiaryDTO> updateDiary(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId,
            @PathVariable Long id,
            @Valid @RequestBody DiaryDTO diaryDTO) {
        
        User user = userService.getOrCreateUser(tempId);
        Optional<DiaryDTO> updatedDiary = diaryService.updateDiary(user, id, diaryDTO);
        
        return updatedDiary.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * 일기 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDiary(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId,
            @PathVariable Long id) {
        
        User user = userService.getOrCreateUser(tempId);
        boolean deleted = diaryService.deleteDiary(user, id);
        
        Map<String, String> response = new HashMap<>();
        if (deleted) {
            response.put("message", "일기가 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "일기를 찾을 수 없습니다.");
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 일기 검색
     */
    @GetMapping("/search")
    public ResponseEntity<Page<DiaryDTO>> searchDiaries(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        User user = userService.getOrCreateUser(tempId);
        Page<DiaryDTO> results;
        
        if (title != null && !title.trim().isEmpty()) {
            results = diaryService.searchByTitle(user, title, page, size);
        } else if (content != null && !content.trim().isEmpty()) {
            results = diaryService.searchByContent(user, content, page, size);
        } else if (startDate != null && endDate != null) {
            results = diaryService.searchByDateRange(user, startDate, endDate, page, size);
        } else {
            results = diaryService.getDiaries(user, page, size);
        }
        
        return ResponseEntity.ok(results);
    }
}
