package com.server.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.server.service.PdfExtractionService;
import com.server.service.SessionService;
import com.server.service.VectorStoreService;
import com.server.service.YouTubeService;
import com.server.model.User;
import com.server.model.UserContent;
import com.server.repository.UserContentRepository;
import com.server.repository.UserRepository;
import com.server.controller.AuthController;
import com.server.service.GeminiService;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "http://localhost:8000")
public class PdfUploadController {

    private final PdfExtractionService pdfExtractionService;
    private final VectorStoreService vectorStoreService;
    private final SessionService sessionService;
    private final UserContentRepository userContentRepository;
    private final UserRepository userRepository;
    private final YouTubeService youTubeService;
    private final GeminiService geminiService;

    @Autowired
    public PdfUploadController(PdfExtractionService pdfExtractionService, VectorStoreService vectorStoreService, SessionService sessionService, UserContentRepository userContentRepository, UserRepository userRepository, YouTubeService youTubeService, GeminiService geminiService) {
        this.pdfExtractionService = pdfExtractionService;
        this.vectorStoreService = vectorStoreService;
        this.sessionService = sessionService;
        this.userContentRepository = userContentRepository;
        this.userRepository = userRepository;
        this.youTubeService = youTubeService;
        this.geminiService = geminiService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file, @RequestHeader("Authorization") String token) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a PDF file to upload.");
        }
        Long userId = AuthController.getUserIdFromToken(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or missing token");
        }
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        try {
            File tempFile = File.createTempFile("uploaded_", ".pdf");
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(file.getBytes());
            }
            String extractedText = pdfExtractionService.extractTextFromPdf(tempFile);
            if (extractedText.startsWith("Error:")) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(extractedText);
            }
            String sessionId = UUID.randomUUID().toString();
            vectorStoreService.buildPdfVectorStore(extractedText);
            sessionService.addPdfText(sessionId, extractedText);
            // Auto-generate summary, video suggestions, podcast script
            String summary = geminiService.processPdfWithGemini(extractedText);
            String podcastScript = geminiService.getPodcastScript(extractedText);
            String subject = geminiService.getSubjectForYouTubeSearch(extractedText);
            List<com.server.model.YouTubeVideo> videos = subject != null ? youTubeService.searchTopRelevantVideos(subject, 10) : null;
            // Save to DB
            UserContent content = new UserContent();
            content.setUser(user);
            content.setSessionId(sessionId);
            content.setOriginalFileName(file.getOriginalFilename());
            content.setExtractedText(extractedText);
            content.setSummary(summary);
            content.setPodcast(podcastScript);
            content.setYoutube(videos != null ? subject + "\n" + videos.toString() : null);
            userContentRepository.save(content);
            tempFile.delete();
            return ResponseEntity.ok(Map.of(
                "sessionId", sessionId,
                "message", "PDF uploaded and content generated successfully.",
                "summary", summary,
                "podcastScript", podcastScript,
                "videoSuggestions", videos
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload or process PDF: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }
} 