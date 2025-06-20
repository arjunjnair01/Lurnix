package com.server.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.google.api.services.youtube.model.Thumbnail;
import com.server.model.YouTubeVideo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;

@Service
public class YouTubeService {

    @Value("${youtube.api.key}")
    private String youtubeApiKey;

    private static final String APPLICATION_NAME = "PDFChatbotYouTubeIntegration";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private final YouTube youtube;

    public YouTubeService() throws GeneralSecurityException, IOException {
        youtube = new YouTube.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                request -> {}
        ).setApplicationName(APPLICATION_NAME).build();
    }

    public List<YouTubeVideo> searchTopRelevantVideos(String query, long maxResults) {
        List<YouTubeVideo> youtubeVideos = new ArrayList<>();

        try {
            // Initialize the search request
            YouTube.Search.List search = youtube.search().list("id,snippet");

            search.setKey(youtubeApiKey);
            search.setQ(query);
            search.setType("video");
            search.setOrder("relevance");
            search.setMaxResults(maxResults);

            search.setFields("items(id/videoId,snippet/title,snippet/description,snippet/thumbnails/high/url,snippet/thumbnails/medium/url,snippet/thumbnails/default/url)");

            SearchListResponse searchResponse = search.execute();
            List<SearchResult> searchResults = searchResponse.getItems();

            if (searchResults != null) {
                for (SearchResult result : searchResults) {
                    String videoId = result.getId().getVideoId();
                    String title = result.getSnippet().getTitle();
                    String description = result.getSnippet().getDescription();

                    Thumbnail thumbnail = result.getSnippet().getThumbnails().getHigh();
                    if (thumbnail == null || thumbnail.getUrl() == null) {
                        thumbnail = result.getSnippet().getThumbnails().getMedium();
                    }
                    if (thumbnail == null || thumbnail.getUrl() == null) {
                        thumbnail = result.getSnippet().getThumbnails().getDefault();
                    }

                    String thumbnailUrl = thumbnail != null ? thumbnail.getUrl() : null;
                    String videoUrl = "https://www.youtube.com/watch?v=" + videoId;

                    youtubeVideos.add(new YouTubeVideo(videoId, title, description, thumbnailUrl, videoUrl));
                }
            }

        } catch (IOException e) {
            System.err.println("Error searching YouTube videos: " + e.getMessage());
        }

        return youtubeVideos;
    }
}
