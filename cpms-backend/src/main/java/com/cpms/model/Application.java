package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting job;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        if (status == null) status = ApplicationStatus.APPLIED;
    }

    public enum ApplicationStatus {
        APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW_SCHEDULED, OFFERED, REJECTED, WITHDRAWN
    }

    // Constructors
    public Application() {}

    // Getters
    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public JobPosting getJob() { return job; }
    public ApplicationStatus getStatus() { return status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public String getCoverLetter() { return coverLetter; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudent(Student student) { this.student = student; }
    public void setJob(JobPosting job) { this.job = job; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private Student student; private JobPosting job;
        private ApplicationStatus status; private LocalDateTime appliedAt; private String coverLetter;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder student(Student student) { this.student = student; return this; }
        public Builder job(JobPosting job) { this.job = job; return this; }
        public Builder status(ApplicationStatus status) { this.status = status; return this; }
        public Builder appliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; return this; }
        public Builder coverLetter(String coverLetter) { this.coverLetter = coverLetter; return this; }
        public Application build() {
            Application a = new Application(); a.id = id; a.student = student; a.job = job;
            a.status = status; a.appliedAt = appliedAt; a.coverLetter = coverLetter; return a;
        }
    }
}
