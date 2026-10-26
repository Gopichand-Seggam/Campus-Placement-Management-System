package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum NotificationType { JOB, INTERVIEW, STATUS, SYSTEM }

    // Constructors
    public Notification() {}

    // Getters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public NotificationType getType() { return type; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setType(NotificationType type) { this.type = type; }
    public void setRead(boolean read) { this.read = read; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Notification n = new Notification();
        public Builder user(User u) { n.user = u; return this; }
        public Builder title(String t) { n.title = t; return this; }
        public Builder message(String m) { n.message = m; return this; }
        public Builder type(NotificationType t) { n.type = t; return this; }
        public Notification build() { return n; }
    }
}
