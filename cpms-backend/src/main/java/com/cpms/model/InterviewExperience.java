package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_experiences")
public class InterviewExperience {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(name = "questions_asked", columnDefinition = "TEXT")
    private String questionsAsked;

    @Column(columnDefinition = "TEXT")
    private String tips;

    @Enumerated(EnumType.STRING)
    private Outcome outcome;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(name = "offer_received")
    private boolean offerReceived = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Outcome { SELECTED, REJECTED, PENDING }
    public enum Difficulty { EASY, MEDIUM, HARD }

    // Constructors
    public InterviewExperience() {}

    // Getters
    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public String getCompanyName() { return companyName; }
    public String getJobRole() { return jobRole; }
    public String getQuestionsAsked() { return questionsAsked; }
    public String getTips() { return tips; }
    public Outcome getOutcome() { return outcome; }
    public Difficulty getDifficulty() { return difficulty; }
    public boolean isOfferReceived() { return offerReceived; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudent(Student student) { this.student = student; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public void setQuestionsAsked(String questionsAsked) { this.questionsAsked = questionsAsked; }
    public void setTips(String tips) { this.tips = tips; }
    public void setOutcome(Outcome outcome) { this.outcome = outcome; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public void setOfferReceived(boolean offerReceived) { this.offerReceived = offerReceived; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
