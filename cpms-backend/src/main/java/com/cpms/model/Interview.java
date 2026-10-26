package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    private InterviewMode mode;

    private String venue;
    private String meetingLink;
    private String notes;

    @Enumerated(EnumType.STRING)
    private InterviewResult result;

    public enum InterviewMode {
        ONLINE, OFFLINE, HYBRID
    }

    public enum InterviewResult {
        PENDING, PASSED, FAILED, NO_SHOW
    }

    // Constructors
    public Interview() {}

    // Getters
    public Long getId() { return id; }
    public Application getApplication() { return application; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public InterviewMode getMode() { return mode; }
    public String getVenue() { return venue; }
    public String getMeetingLink() { return meetingLink; }
    public String getNotes() { return notes; }
    public InterviewResult getResult() { return result; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setApplication(Application application) { this.application = application; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public void setMode(InterviewMode mode) { this.mode = mode; }
    public void setVenue(String venue) { this.venue = venue; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setResult(InterviewResult result) { this.result = result; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private Application application; private LocalDateTime scheduledAt;
        private InterviewMode mode; private String venue; private String meetingLink;
        private String notes; private InterviewResult result;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder application(Application application) { this.application = application; return this; }
        public Builder scheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; return this; }
        public Builder mode(InterviewMode mode) { this.mode = mode; return this; }
        public Builder venue(String venue) { this.venue = venue; return this; }
        public Builder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder result(InterviewResult result) { this.result = result; return this; }
        public Interview build() {
            Interview i = new Interview(); i.id = id; i.application = application;
            i.scheduledAt = scheduledAt; i.mode = mode; i.venue = venue;
            i.meetingLink = meetingLink; i.notes = notes; i.result = result; return i;
        }
    }
}
