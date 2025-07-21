package com.diary.service;

import com.diary.entity.User;
import com.diary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 새로운 임시 사용자 생성
     */
    public String createTempUser() {
        String tempId;
        do {
            tempId = "temp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        } while (userRepository.existsByTempId(tempId));
        
        User user = new User(tempId);
        userRepository.save(user);
        
        return tempId;
    }
    
    /**
     * 임시 ID로 사용자 조회
     */
    @Transactional(readOnly = true)
    public Optional<User> findByTempId(String tempId) {
        return userRepository.findByTempId(tempId);
    }
    
    /**
     * 임시 ID 유효성 검증
     */
    @Transactional(readOnly = true)
    public boolean validateTempId(String tempId) {
        return userRepository.existsByTempId(tempId);
    }
    
    /**
     * 사용자 마지막 접근 시간 업데이트
     */
    public void updateLastAccessedAt(String tempId) {
        userRepository.updateLastAccessedAt(tempId, LocalDateTime.now());
    }
    
    /**
     * 사용자 조회 또는 생성
     */
    public User getOrCreateUser(String tempId) {
        if (tempId == null || tempId.trim().isEmpty()) {
            // 새 사용자 생성
            String newTempId = createTempUser();
            return userRepository.findByTempId(newTempId).orElseThrow();
        }
        
        Optional<User> user = findByTempId(tempId);
        if (user.isPresent()) {
            updateLastAccessedAt(tempId);
            return user.get();
        } else {
            // 존재하지 않는 임시 ID인 경우 새 사용자 생성
            String newTempId = createTempUser();
            return userRepository.findByTempId(newTempId).orElseThrow();
        }
    }
}
