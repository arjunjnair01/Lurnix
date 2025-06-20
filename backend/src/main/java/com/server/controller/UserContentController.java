package com.server.controller;

import com.server.model.UserContent;
import com.server.repository.UserContentRepository;
import com.server.repository.UserRepository;
import com.server.controller.AuthController;
import com.server.dto.UserContentHistoryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:8000")
public class UserContentController {
    private final UserContentRepository userContentRepository;
    private final UserRepository userRepository;

    @Autowired
    public UserContentController(UserContentRepository userContentRepository, UserRepository userRepository) {
        this.userContentRepository = userContentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<List<UserContentHistoryDto>> getUserHistory(@RequestHeader("Authorization") String token) {
        Long userId = AuthController.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(401).body(null); // Return 401 with null body for type safety
        }

        // Explicitly check if the user exists
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(404).body(null); // Return 404 with null body for type safety
        }

        List<UserContent> userContents = userContentRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        List<UserContentHistoryDto> historyDtos = userContents.stream()
            .map(content -> new UserContentHistoryDto(
                content.getSessionId(),
                content.getOriginalFileName(),
                content.getCreatedAt(),
                content.getSummary() != null && !content.getSummary().isEmpty(),
                content.getPodcast() != null && !content.getPodcast().isEmpty(),
                content.getQuiz() != null && !content.getQuiz().isEmpty(),
                content.getYoutube() != null && !content.getYoutube().isEmpty()
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(historyDtos);
    }
} 