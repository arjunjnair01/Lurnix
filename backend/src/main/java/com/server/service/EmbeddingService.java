package com.server.service;


import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class EmbeddingService {

    // Placeholder for embedding model. In a real app, you'd use a Java library
    // (e.g., ONNX Runtime with a sentence transformer model) or an external API.
    // For this example, we'll return a dummy embedding.
    public List<Double> getEmbedding(String text) {
        // In a real scenario, this would call an embedding model
        // For demonstration, returning a simple hash-based "embedding"
        long hash = text.hashCode();
        List<Double> embedding = new ArrayList<>();
        for (int i = 0; i < 384; i++) { // Sentence-BERT typically uses 384 or 768 dimensions
            embedding.add((double) (hash % 1000) / 1000.0); // Simple dummy values
            hash = hash / 2;
            if (hash == 0) hash = text.hashCode(); // Reset hash to avoid all zeros quickly
        }
        return embedding;
    }

    /**
     * Chunks text into smaller pieces.
     * @param text The input text.
     * @param chunkSize The maximum size of each chunk.
     * @return A list of text chunks.
     */
    public List<String> chunkText(String text, int chunkSize) {
        List<String> chunks = new ArrayList<>();
        for (int i = 0; i < text.length(); i += chunkSize) {
            chunks.add(text.substring(i, Math.min(i + chunkSize, text.length())));
        }
        return chunks;
    }
}
