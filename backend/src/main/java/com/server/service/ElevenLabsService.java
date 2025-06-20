package com.server.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class ElevenLabsService {

    @Value("${elevenlabs.api.key}")
    private String elevenLabsApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String convertScriptToAudio(String script, String outputFilePath) {
        List<String> tempAudioPaths = new ArrayList<>();

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            Map<String, String> voiceMap = getVoiceIdMap(httpClient);
            System.out.println("Voice map: " + voiceMap);

            String[] lines = script.split("\n");
            String currentSpeaker = null;
            StringBuilder currentText = new StringBuilder();

            for (String line : lines) {
                line = cleanText(line);
                if (line.trim().isEmpty()) continue;

                String newSpeaker = null;
                String lineText = "";

                String trimmedLine = line.trim();
                if (trimmedLine.toLowerCase().startsWith("sarah:")) {
                    newSpeaker = "Sarah";
                    lineText = trimmedLine.substring("Sarah:".length()).trim();
                } else if (trimmedLine.toLowerCase().startsWith("dr. adam:")) {
                    newSpeaker = "Dr. Adam";
                    lineText = trimmedLine.substring("Dr. Adam:".length()).trim();
                }else {
                    lineText = line;
                }
                System.out.println("Available voices: " + voiceMap.keySet());

                if (newSpeaker != null && currentText.length() > 0) {
                    // Generate audio for previous speaker
                    synthesizeAndSaveAudio(httpClient, currentText.toString(), currentSpeaker, voiceMap, tempAudioPaths, outputFilePath);
                    currentText.setLength(0);
                }

                if (newSpeaker != null) {
                    currentSpeaker = newSpeaker;
                }

                currentText.append(lineText).append(" ");
            }

            // Generate audio for the last chunk
            if (currentText.length() > 0 && currentSpeaker != null) {
                synthesizeAndSaveAudio(httpClient, currentText.toString(), currentSpeaker, voiceMap, tempAudioPaths, outputFilePath);
            }

            if (!tempAudioPaths.isEmpty()) {
                mergeMp3Files(tempAudioPaths, outputFilePath);
                System.out.println("Final merged audio saved to: " + outputFilePath);
                tempAudioPaths.forEach(path -> new File(path).delete());
                return "Audio created successfully.";
            } else {
                return "No audio segments were generated.";
            }

        } catch (IOException e) {
            e.printStackTrace();
            return "Error: Failed to connect to ElevenLabs API.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: Unexpected error during audio processing.";
        }
    }

    private void synthesizeAndSaveAudio(CloseableHttpClient httpClient, String text, String speaker, Map<String, String> voiceMap, List<String> tempAudioPaths, String outputFilePath) throws IOException {
        String voiceName = switch (speaker) {
            case "Sarah" -> "Sarah"; // actual voice in your map
            case "Dr. Adam" -> "Brian"; // use Brian for Dr. Adam
            default -> "Sarah"; // default fallback
        };

        String voiceId = voiceMap.get(voiceName);
        if (voiceId == null) {
            System.err.println("Voice ID not found for: " + voiceName + ". Falling back to Sarah.");
            voiceId = voiceMap.get("Sarah");
        }
        if (voiceId == null) {
            System.err.println("Critical: Voice ID for 'Sarah' not found in voice map.");
            return;
        }

        String url = "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId;
        HttpPost httpPost = new HttpPost(url);
        httpPost.addHeader("xi-api-key", elevenLabsApiKey);
        httpPost.addHeader("Content-Type", "application/json");
        httpPost.addHeader("Accept", "audio/mpeg");

        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("text", text);
        requestBody.put("model_id", "eleven_monolingual_v1");

        ObjectNode voiceSettings = objectMapper.createObjectNode();
        voiceSettings.put("stability", 0.5);
        voiceSettings.put("similarity_boost", 0.75);
        requestBody.set("voice_settings", voiceSettings);

        StringEntity entity = new StringEntity(requestBody.toString(), ContentType.APPLICATION_JSON);
        httpPost.setEntity(entity);

        httpClient.execute(httpPost, response -> {
            HttpEntity responseEntity = response.getEntity();
            if (responseEntity != null && response.getCode() == 200) {
                String tempAudioFile = outputFilePath.replace(".mp3", "") + "_" + UUID.randomUUID().toString().substring(0, 8) + ".mp3";
                try (InputStream is = responseEntity.getContent();
                     FileOutputStream fos = new FileOutputStream(tempAudioFile)) {
                    byte[] buffer = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = is.read(buffer)) != -1) {
                        fos.write(buffer, 0, bytesRead);
                    }
                    tempAudioPaths.add(tempAudioFile);
                    System.out.println("Saved audio: " + tempAudioFile);
                }
            } else {
                String errorBody = responseEntity != null ? EntityUtils.toString(responseEntity) : "No response body";
                System.err.println("API error: " + response.getCode() + ", " + errorBody);
            }
            return null;
        });
    }

    private Map<String, String> getVoiceIdMap(CloseableHttpClient httpClient) throws IOException {
        Map<String, String> voiceMap = new HashMap<>();
        HttpGet httpGet = new HttpGet("https://api.elevenlabs.io/v1/voices");
        httpGet.addHeader("xi-api-key", elevenLabsApiKey);

        httpClient.execute(httpGet, response -> {
            if (response.getCode() == 200) {
                HttpEntity responseEntity = response.getEntity();
                String result = EntityUtils.toString(responseEntity);
                JsonNode root = objectMapper.readTree(result);
                for (JsonNode voiceNode : root.get("voices")) {
                    String name = voiceNode.get("name").asText();
                    String id = voiceNode.get("voice_id").asText();
                    voiceMap.put(name, id);
                }
            } else {
                throw new IOException("Failed to fetch voices. Status code: " + response.getCode());
            }
            return null;
        });
        return voiceMap;
    }

    private String cleanText(String text) {
        return text.replace("**", "")
                .replace("#", "")
                .replace("```", "")
                .replaceAll("\\(Host\\)", "")
                .replaceAll("\\(Expert\\)", "")
                .trim();
    }

    private void mergeMp3Files(List<String> mp3Files, String outputMergedFilePath) throws IOException {
        Path tempListFile = Files.createTempFile("ffmpeg_concat_list", ".txt");
        try (BufferedWriter writer = Files.newBufferedWriter(tempListFile)) {
            for (String file : mp3Files) {
                writer.write("file '" + new File(file).getAbsolutePath().replace("'", "'\\''") + "'\n");
            }
        }

        ProcessBuilder pb = new ProcessBuilder(
                "ffmpeg", "-f", "concat", "-safe", "0",
                "-i", tempListFile.toAbsolutePath().toString(),
                "-c", "copy", outputMergedFilePath
        );

        pb.inheritIO(); // Show ffmpeg logs
        Process process = pb.start();
        try {
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IOException("FFmpeg failed with exit code: " + exitCode);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("FFmpeg process interrupted", e);
        } finally {
            Files.deleteIfExists(tempListFile);
        }
    }
}
