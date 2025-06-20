package com.server.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class VectorStoreService {

    private final EmbeddingService embeddingService;
    // In-memory representation of a vector store: Map of ID to (text, embedding)
    private final Map<String, Map<String, Object>> collection = new HashMap<>();

    @Autowired
    public VectorStoreService(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    /**
     * Builds a PDF vector store by chunking text, generating embeddings, and storing them.
     * @param pdfText The full text from the PDF.
     * @return A identifier for the collection (in this case, just a confirmation string).
     */
    public String buildPdfVectorStore(String pdfText) {
        collection.clear(); // Clear previous data for simplicity in this in-memory example
        List<String> chunks = embeddingService.chunkText(pdfText, 500); // Same chunk size as Python

        for (int i = 0; i < chunks.size(); i++) {
            String chunk = chunks.get(i);
            List<Double> embedding = embeddingService.getEmbedding(chunk);
            String id = "chunk_" + i;

            Map<String, Object> entry = new HashMap<>();
            entry.put("document", chunk);
            entry.put("embedding", embedding);
            collection.put(id, entry);
        }
        return "PDF vector store built with " + chunks.size() + " chunks.";
    }

    /**
     * Queries the vector store for the top K most relevant chunks based on a user question.
     * This is a simplified similarity search using Euclidean distance for demonstration.
     * @param userQuestion The user's question.
     * @param topK The number of top chunks to retrieve.
     * @return A list of retrieved text chunks.
     */
    public List<String> queryVectorStore(String userQuestion, int topK) {
        if (collection.isEmpty()) {
            return new ArrayList<>(); // Return empty if no data is stored
        }

        List<Double> queryEmbedding = embeddingService.getEmbedding(userQuestion);

        // Calculate similarity (using Euclidean distance for simplicity, lower is better)
        List<Map.Entry<String, Map<String, Object>>> sortedChunks = collection.entrySet().stream()
                .sorted(Comparator.comparingDouble(entry -> {
                    @SuppressWarnings("unchecked")
                    List<Double> chunkEmbedding = (List<Double>) entry.getValue().get("embedding");
                    return euclideanDistance(queryEmbedding, chunkEmbedding);
                }))
                .collect(Collectors.toList());

        List<String> retrievedChunks = new ArrayList<>();
        for (int i = 0; i < Math.min(topK, sortedChunks.size()); i++) {
            retrievedChunks.add((String) sortedChunks.get(i).getValue().get("document"));
        }
        return retrievedChunks;
    }

    /**
     * Calculates the Euclidean distance between two vectors.
     * @param vec1 The first vector.
     * @param vec2 The second vector.
     * @return The Euclidean distance.
     */
    private double euclideanDistance(List<Double> vec1, List<Double> vec2) {
        if (vec1.size() != vec2.size()) {
            throw new IllegalArgumentException("Vectors must have the same dimension.");
        }
        double sumSq = 0;
        for (int i = 0; i < vec1.size(); i++) {
            sumSq += Math.pow(vec1.get(i) - vec2.get(i), 2);
        }
        return Math.sqrt(sumSq);
    }
}
