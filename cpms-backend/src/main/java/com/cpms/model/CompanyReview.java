package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "company_reviews")
public class CompanyReview {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private int rating; // 1-5

    @Column(name = "review_text", length = 1000)
    private String reviewText;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(name = "job_role")
    private String jobRole;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public enum Difficulty { EASY, MEDIUM, HARD }

    // Constructors
    public CompanyReview() {}

    // Getters
    public Long getId() { return id; }
    public Student getStudent() { return student; }
    public Company getCompany() { return company; }
    public int getRating() { return rating; }
    public String getReviewText() { return reviewText; }
    public Difficulty getDifficulty() { return difficulty; }
    public String getJobRole() { return jobRole; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setStudent(Student student) { this.student = student; }
    public void setCompany(Company company) { this.company = company; }
    public void setRating(int rating) { this.rating = rating; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
