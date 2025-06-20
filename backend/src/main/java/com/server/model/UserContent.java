package com.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_content")
public class UserContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String sessionId;

    private String originalFileName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String extractedText;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String summary;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String podcast;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String quiz;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String video;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String youtube;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getPodcast() { return podcast; }
    public void setPodcast(String podcast) { this.podcast = podcast; }
    public String getQuiz() { return quiz; }
    public void setQuiz(String quiz) { this.quiz = quiz; }
    public String getVideo() { return video; }
    public void setVideo(String video) { this.video = video; }
    public String getYoutube() { return youtube; }
    public void setYoutube(String youtube) { this.youtube = youtube; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 