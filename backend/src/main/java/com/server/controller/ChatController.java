package com.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.model.ChatMessage;
import com.server.service.GeminiService;
import com.server.service.SessionService;
import com.server.service.VectorStoreService;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:8081")
public class ChatController {

    private final GeminiService geminiService;
    private final VectorStoreService vectorStoreService;
    private final SessionService sessionService;
    private final Map<String, String> sessionPdfTexts = new ConcurrentHashMap<>();
    private final Map<String, List<Map<String, String>>> sessionChatHistories = new ConcurrentHashMap<>();

    @Autowired
    public ChatController(GeminiService geminiService, VectorStoreService vectorStoreService, SessionService sessionService) {
        this.geminiService = geminiService;
        this.vectorStoreService = vectorStoreService;
        this.sessionService = sessionService;
    }

    @PostMapping("/chat/{sessionId}")
    public ResponseEntity<?> chatWithPdf(@PathVariable String sessionId, @RequestBody ChatMessage chatMessage) {
        String userQuestion = chatMessage.getContent();
        if (userQuestion == null || userQuestion.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("User question cannot be empty.");
        }

        String pdfText = sessionService.getPdfText(sessionId);
        if (pdfText == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No PDF text found for the given session ID. Please upload a PDF first.");
        }

        List<Map<String, String>> history = sessionChatHistories.computeIfAbsent(sessionId, k -> new ArrayList<>());

        List<String> retrievedChunks = vectorStoreService.queryVectorStore(userQuestion, 3);
        String context = String.join("\n", retrievedChunks);

        String answer = geminiService.queryPdfChat(userQuestion, context, history);
        if (answer.startsWith("Error:")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(answer);
        }

        history.add(Map.of("role", "user", "content", userQuestion));
        history.add(Map.of("role", "assistant", "content", answer));

        return ResponseEntity.ok(new ChatMessage("assistant", answer));
    }
} 