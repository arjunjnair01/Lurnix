package com.server.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {

    private final Map<String, String> sessionPdfTexts = new ConcurrentHashMap<>();

    public String getPdfText(String sessionId) {
        return sessionPdfTexts.get(sessionId);
    }

    public void addPdfText(String sessionId, String pdfText) {
        sessionPdfTexts.put(sessionId, pdfText);
    }

    public boolean hasPdfText(String sessionId) {
        return sessionPdfTexts.containsKey(sessionId);
    }
} 