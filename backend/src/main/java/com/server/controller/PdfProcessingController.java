package com.server.controller;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.service.GeminiService;
import com.server.service.SessionService;
import com.server.model.User;
import com.server.model.UserContent;
import com.server.repository.UserContentRepository;
import com.server.repository.UserRepository;
import com.server.controller.AuthController;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:8000")
public class PdfProcessingController {

    private final GeminiService geminiService;
    private final SessionService sessionService;
    private final UserContentRepository userContentRepository;
    private final UserRepository userRepository;

    @Autowired
    public PdfProcessingController(GeminiService geminiService, SessionService sessionService, UserContentRepository userContentRepository, UserRepository userRepository) {
        this.geminiService = geminiService;
        this.sessionService = sessionService;
        this.userContentRepository = userContentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/process/{sessionId}")
    public ResponseEntity<?> processPdf(@PathVariable String sessionId, @RequestHeader("Authorization") String token) {
        Long userId = AuthController.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        UserContent content = userContentRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream().filter(c -> c.getSessionId().equals(sessionId)).findFirst().orElse(null);
        if (content == null || content.getExtractedText() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No PDF text found for the given session ID. Please upload a PDF first.");
        }
        String geminiResponse = geminiService.processPdfWithGemini(content.getExtractedText());
        if (geminiResponse.startsWith("Error:")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(geminiResponse);
        }
        content.setSummary(geminiResponse);
        userContentRepository.save(content);
        return ResponseEntity.ok(Map.of("analysis", geminiResponse));
    }
} 