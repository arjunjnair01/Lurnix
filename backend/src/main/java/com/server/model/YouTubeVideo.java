package com.server.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class YouTubeVideo {

    private String id;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String videoUrl;

    // Annotation for JSON deserialization
    @JsonCreator
    public YouTubeVideo(
            @JsonProperty("id") String videoId,
            @JsonProperty("title") String title,
            @JsonProperty("description") String description,
            @JsonProperty("thumbnailUrl") String thumbnailUrl,
            @JsonProperty("videoUrl") String videoUrl) {
        this.id = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.videoUrl = videoUrl;
    }

    // Getter for id
    public String getId() {
        return id;
    }

    // Setter for id
    public void setId(String id) {
        this.id = id;
    }

    // Getter for title
    public String getTitle() {
        return title;
    }

    // Setter for title
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter for description
    public String getDescription() {
        return description;
    }

    // Setter for description
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for thumbnailUrl
    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    // Setter for thumbnailUrl
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    // Getter for videoUrl
    public String getVideoUrl() {
        return videoUrl;
    }

    // Setter for videoUrl
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    @Override
    public String toString() {
        return "YouTubeVideo{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", thumbnailUrl='" + thumbnailUrl + '\'' +
                ", videoUrl='" + videoUrl + '\'' +
                '}';
    }
}
