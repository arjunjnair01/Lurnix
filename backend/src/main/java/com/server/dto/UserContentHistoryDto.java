package com.server.dto;

import java.time.LocalDateTime;

public class UserContentHistoryDto {
    private String sessionId;
    private String fileName;
    private LocalDateTime createdAt;
    private boolean hasSummary;
    private boolean hasPodcastScript;
    private boolean hasQuiz;
    private boolean hasVideoSuggestions;

    // Constructor
    public UserContentHistoryDto(String sessionId, String fileName, LocalDateTime createdAt, boolean hasSummary, boolean hasPodcastScript, boolean hasQuiz, boolean hasVideoSuggestions) {
        this.sessionId = sessionId;
        this.fileName = fileName;
        this.createdAt = createdAt;
        this.hasSummary = hasSummary;
        this.hasPodcastScript = hasPodcastScript;
        this.hasQuiz = hasQuiz;
        this.hasVideoSuggestions = hasVideoSuggestions;
    }

    // Getters
    public String getSessionId() {
        return sessionId;
    }

    public String getFileName() {
        return fileName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isHasSummary() {
        return hasSummary;
    }

    public boolean isHasPodcastScript() {
        return hasPodcastScript;
    }

    public boolean isHasQuiz() {
        return hasQuiz;
    }

    public boolean isHasVideoSuggestions() {
        return hasVideoSuggestions;
    }
} 