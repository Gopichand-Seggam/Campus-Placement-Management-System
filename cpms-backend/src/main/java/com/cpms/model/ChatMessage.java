package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private ChatSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private String role;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }

    // Constructors
    public ChatMessage() {}

    // Getters
    public Long getId() { return id; }
    
    @com.fasterxml.jackson.annotation.JsonIgnore
    public ChatSession getSession() { return session; }
    
    public String getRole() { return role; }
    public String getContent() { return content; }
    public LocalDateTime getTimestamp() { return timestamp; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setSession(ChatSession session) { this.session = session; }
    public void setRole(String role) { this.role = role; }
    public void setContent(String content) { this.content = content; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private ChatSession session; private User user; private String role;
        private String content; private LocalDateTime timestamp;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder session(ChatSession session) { this.session = session; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder content(String content) { this.content = content; return this; }
        public Builder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }
        public ChatMessage build() {
            ChatMessage c = new ChatMessage(); c.id = id; c.session = session;
            c.user = user; c.role = role; c.content = content; c.timestamp = timestamp; return c;
        }
    }
}
