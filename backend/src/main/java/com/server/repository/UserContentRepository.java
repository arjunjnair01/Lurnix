package com.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.server.model.UserContent;

import java.util.List;

@Repository
public interface UserContentRepository extends JpaRepository<UserContent, Long> {
    List<UserContent> findAllByUserIdOrderByCreatedAtDesc(Long userId);
} 