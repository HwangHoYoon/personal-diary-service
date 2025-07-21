package com.diary.controller;

import com.diary.dto.StatisticsDTO;
import com.diary.entity.User;
import com.diary.service.StatisticsService;
import com.diary.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {
    
    @Autowired
    private StatisticsService statisticsService;
    
    @Autowired
    private UserService userService;
    
    /**
     * 사용자 통계 조회
     */
    @GetMapping
    public ResponseEntity<StatisticsDTO> getStatistics(
            @RequestHeader(value = "X-Temp-Id", required = false) String tempId) {
        
        User user = userService.getOrCreateUser(tempId);
        StatisticsDTO statistics = statisticsService.getUserStatistics(user);
        
        return ResponseEntity.ok(statistics);
    }
}
