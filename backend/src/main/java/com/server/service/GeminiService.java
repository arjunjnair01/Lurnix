package com.server.service;
import java.io.IOException;
import java.util.List;
import java.util.Map;

// Correct imports for Apache HttpClient 5.x
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType; // Also from core5 for ContentType
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Gson gson = new Gson();
    
    

    /**
     * Processes PDF text using the Gemini API to extract information and explanations.
     * @param pdfText The text extracted from the PDF.
     * @return The response from the Gemini API.
     */
    public String processPdfWithGemini(String pdfText) {
    	System.out.println("Calling Gemini API with URL: " + GEMINI_API_URL + geminiApiKey);
        String prompt = String.format(
                """
                You are an expert document analyst. Analyze the text I provide from a PDF which is related to educational concepts
                and extract all relevant information. Your task is to extract all of the content within the document and provide a comprehensive explanation of
                each element in a way that is easily understandable for someone with a beginner-level understanding of education.
                Organize your response in a structured manner, using headings or bullet points to clearly separate each extracted element and its corresponding explanation.
                Prioritize clarity and accessibility over exhaustive detail. The goal is to transform the document's contents into easily digestible knowledge for a beginner audience.
                Ensure that the explanations are detailed enough to provide a solid foundation for further learning.

                Here is the text from the PDF:
                ```%s```
                """, pdfText
        );
        return callGeminiApi(prompt);
    }

    /**
     * Generates a podcast script based on PDF content using the Gemini API.
     * @param pdfText The text extracted from the PDF.
     * @return The generated podcast script.
     */
    public String getPodcastScript(String pdfText) {
        String prompt = String.format(
                """
                You are a podcast scriptwriter. Create a conversational podcast script between 'Sarah' (the host) and 'Dr. Adam' (the expert) based on the following article content:

                %s

                **IMPORTANT INSTRUCTIONS:**
                - Only output the spoken dialogue lines, alternating between Sarah and Dr. Adam.
                - Do NOT include podcast titles, episode titles, music cues, intros, outros, or any non-dialogue text.
                - Do NOT use markdown formatting, asterisks, or speaker roles in parentheses.
                - Each line should start with the speaker's name followed by a colon, e.g., Sarah: Hello!
                - The script should be engaging, informative, and last approximately 5 minutes. Sarah should ask probing questions, and Dr. Adam should provide detailed answers based on the text.
                - Do NOT include any instructions, explanations, or formatting—**only the dialogue lines**.

                Begin the script now:
                """, pdfText
        );
        return callGeminiApi(prompt);
    }
    public String getVideoScript(String pdfText) {
        String prompt = String.format(
                """
                You are a professional video scriptwriter. Based on the following article content, generate a compelling and engaging script for an educational video. The script should be designed for a faceless video that is around 1.5 minutes long.

                Content to use:
                %s

                **IMPORTANT GUIDELINES:**
                - The script should be written in a scene-by-scene format.
                - Each scene should include two parts:
                  1. **Narration** (what the voiceover will say)
                  2. **Visual description** (what should be shown on screen)
                - Do NOT include any markdown formatting or bullet points.
                - Avoid listing "Scene 1", "Scene 2", etc. — just keep it natural and flowing, but separate each scene clearly.
                - The visuals should reflect the content. For example, if the topic is Newton's First Law of Motion, include visual scenes of objects in motion, everyday examples, and animations of forces acting on bodies.
                - Make the tone clear, educational, and slightly conversational.
                - End the script naturally, summarizing the idea if appropriate.

                Only return the final script in the format:

                Narration: [spoken line]
                Visual: [description of the visuals for this line]

                Begin the script:
                """, pdfText
        );
        return callGeminiApi(prompt);
    }


    /**
     * Queries the Gemini API for a chatbot response using RAG (Retrieval-Augmented Generation) context.
     * @param userQuestion The user's question.
     * @param context The retrieved context from the vector store.
     * @param history The conversation history.
     * @return The chatbot's answer.
     */
    public String queryPdfChat(String userQuestion, String context, List<Map<String, String>> history) {
        StringBuilder historyText = new StringBuilder();
        if (history != null) {
            for (Map<String, String> turn : history) {
                historyText.append(turn.get("role")).append(": ").append(turn.get("content")).append("\n");
            }
        }

        String prompt = String.format(
                """
                You are an expert assistant. Use the following context from a document to answer the user's question.

                Context:
                %s

                Conversation so far:
                %sUser: %s

                Answer:""",
                context, historyText.toString(), userQuestion
        );
        return callGeminiApi(prompt);
    }

    /**
     * Generic method to call the Gemini API.
     * @param prompt The prompt to send to the Gemini API.
     * @return The generated text response.
     */
    
    private String callGeminiApi(String prompt) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(GEMINI_API_URL + geminiApiKey);
            httpPost.addHeader("Content-Type", "application/json");

            JsonObject content = new JsonObject();
            JsonObject parts = new JsonObject();
            parts.addProperty("text", prompt);
            content.add("parts", gson.toJsonTree(new JsonObject[]{parts}));

            JsonObject payload = new JsonObject();
            payload.add("contents", gson.toJsonTree(new JsonObject[]{content}));

            StringEntity entity = new StringEntity(payload.toString(), ContentType.APPLICATION_JSON); // Specify ContentType here
            httpPost.setEntity(entity);

            return httpClient.execute(httpPost, response -> {
                String jsonResponse = EntityUtils.toString(response.getEntity());
                JsonNode root = objectMapper.readTree(jsonResponse);

                // Navigate to the answer in the JSON structure
                JsonNode candidates = root.get("candidates");
                if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                    JsonNode contentNode = candidates.get(0).get("content");
                    if (contentNode != null) {
                        JsonNode partsNode = contentNode.get("parts");
                        if (partsNode != null && partsNode.isArray() && partsNode.size() > 0) {
                            JsonNode textNode = partsNode.get(0).get("text");
                            if (textNode != null) {
                                return textNode.asText();
                            }
                        }
                    }
                }
                System.err.println("Unexpected Gemini API response structure: " + jsonResponse);
                return "Error: Could not parse Gemini API response.";
            });
        } catch (IOException e) {
            System.err.println("Error communicating with Gemini API: " + e.getMessage());
            return "Error: Failed to connect to Gemini API.";
        }
    }
    
    public String getSubjectForYouTubeSearch(String content) {
        try {
            String prompt = "Analyze the following text and identify the core subject or topic. " +
                            "Return only the subject title without explanation:\n\n" + content;

            return callGeminiApi(prompt); // Or however you're calling Gemini
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    public String generateQuizFromPdf(String content) {
        try {
            String prompt = "Generate a quiz with 15 multiple-choice questions based on the following content. For each question, use this JSON format: " +
                "[ { \"question\": \"...\", \"options\": [\"...\", \"...\", \"...\", \"...\"], \"answer\": 1 }, ... ] " +
                "Return only the JSON array. Do not include any explanation, markdown, or code block. Content: " + content;

            String result = callGeminiApi(prompt);
            // Remove code block markers if present
            if (result != null) {
                result = result.trim();
                if (result.startsWith("```json")) result = result.substring(7);
                if (result.startsWith("```")) result = result.substring(3);
                if (result.endsWith("```")) result = result.substring(0, result.length() - 3);
                result = result.trim();
            }
            return result;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}