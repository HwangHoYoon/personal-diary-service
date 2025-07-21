package com.diary.repository;

import com.diary.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByTempId(String tempId);
    
    boolean existsByTempId(String tempId);
    
    @Modifying
    @Query("UPDATE User u SET u.lastAccessedAt = :accessTime WHERE u.tempId = :tempId")
    void updateLastAccessedAt(@Param("tempId") String tempId, @Param("accessTime") LocalDateTime accessTime);
}
