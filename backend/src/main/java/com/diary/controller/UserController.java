package com.diary.controller;

import com.diary.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 새로운 임시 사용자 생성
     */
    @PostMapping("/temp")
    public ResponseEntity<Map<String, String>> createTempUser() {
        String tempId = userService.createTempUser();
        
        Map<String, String> response = new HashMap<>();
        response.put("tempId", tempId);
        response.put("message", "임시 사용자가 생성되었습니다.");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 임시 ID 유효성 검증
     */
    @GetMapping("/validate/{tempId}")
    public ResponseEntity<Map<String, Object>> validateTempId(@PathVariable String tempId) {
        boolean isValid = userService.validateTempId(tempId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);
        response.put("tempId", tempId);
        
        if (isValid) {
            userService.updateLastAccessedAt(tempId);
            response.put("message", "유효한 임시 ID입니다.");
        } else {
            response.put("message", "유효하지 않은 임시 ID입니다.");
        }
        
        return ResponseEntity.ok(response);
    }
}
