package com.server.controller;

import java.io.File;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.server.service.ElevenLabsService;
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
public class PodcastController {

    private final GeminiService geminiService;
    private final ElevenLabsService elevenLabsService;
    private final SessionService sessionService;
    private final UserContentRepository userContentRepository;
    private final UserRepository userRepository;

    @Autowired
    public PodcastController(GeminiService geminiService, ElevenLabsService elevenLabsService, SessionService sessionService, UserContentRepository userContentRepository, UserRepository userRepository) {
        this.geminiService = geminiService;
        this.elevenLabsService = elevenLabsService;
        this.sessionService = sessionService;
        this.userContentRepository = userContentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/podcast-script/{sessionId}")
    public ResponseEntity<?> generatePodcastScript(@PathVariable String sessionId, @RequestHeader("Authorization") String token) {
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
        String podcastScript = geminiService.getPodcastScript(content.getExtractedText());
        if (podcastScript.startsWith("Error:")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(podcastScript);
        }
        content.setPodcast(podcastScript);
        userContentRepository.save(content);
        return ResponseEntity.ok(Map.of("script", podcastScript));
    }

    @PostMapping("/text-to-speech")
    public ResponseEntity<?> convertTextToSpeech(@RequestBody Map<String, String> scriptRequest) {
        String script = scriptRequest.get("script");
        if (script == null || script.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Script content is required for text-to-speech conversion.");
        }

        String outputFileName = "podcast_audio_" + UUID.randomUUID().toString().substring(0, 8) + ".mp3";
        String outputPath = "temp/" + outputFileName;

        new File("temp").mkdirs();

        String result = elevenLabsService.convertScriptToAudio(script, outputPath);

        if (result.startsWith("Error:")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
        return ResponseEntity.ok(Map.of("message", "Audio generation initiated. Check backend logs for details. Output: " + outputPath));
    }
} 