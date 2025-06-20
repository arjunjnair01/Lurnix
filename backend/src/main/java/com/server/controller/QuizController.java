package com.server.controller;

import java.util.Map;

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
public class QuizController {

    private final GeminiService geminiService;
    private final SessionService sessionService;
    private final UserContentRepository userContentRepository;
    private final UserRepository userRepository;

    @Autowired
    public QuizController(GeminiService geminiService, SessionService sessionService, UserContentRepository userContentRepository, UserRepository userRepository) {
        this.geminiService = geminiService;
        this.sessionService = sessionService;
        this.userContentRepository = userContentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/generate-quiz/{sessionId}")
    public ResponseEntity<?> generateQuiz(@PathVariable String sessionId, @RequestHeader("Authorization") String token) {
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No PDF text found for the given session ID.");
        }
        String prompt = "Generate a set of quiz questions, including multiple-choice questions (MCQs) and other possible questions, based on the following PDF content. Provide the correct answers as well.\n\n" + content.getExtractedText();
        String quizContent = geminiService.generateQuizFromPdf(prompt);
        if (quizContent.startsWith("Error:")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to generate quiz: " + quizContent);
        }
        return ResponseEntity.ok(Map.of("quiz", quizContent));
    }
} 
