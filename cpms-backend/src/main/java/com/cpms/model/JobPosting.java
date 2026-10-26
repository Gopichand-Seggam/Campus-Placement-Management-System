package com.cpms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String requiredSkills;
    private String jobType;
    private String location;
    private String sector;
    private Double ctcMin;
    private Double ctcMax;
    private Integer openings;
    private LocalDate applicationDeadline;
    private Double minCgpa;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Column(name = "posted_at")
    private LocalDateTime postedAt;

    @PrePersist
    protected void onCreate() {
        postedAt = LocalDateTime.now();
        if (status == null) status = JobStatus.ACTIVE;
    }

    public enum JobStatus {
        ACTIVE, CLOSED, DRAFT
    }

    // Constructors
    public JobPosting() {}

    // Getters
    public Long getId() { return id; }
    public Company getCompany() { return company; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRequiredSkills() { return requiredSkills; }
    public String getJobType() { return jobType; }
    public String getLocation() { return location; }
    public String getSector() { return sector; }
    public Double getCtcMin() { return ctcMin; }
    public Double getCtcMax() { return ctcMax; }
    public Integer getOpenings() { return openings; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public Double getMinCgpa() { return minCgpa; }
    public JobStatus getStatus() { return status; }
    public LocalDateTime getPostedAt() { return postedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setCompany(Company company) { this.company = company; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public void setJobType(String jobType) { this.jobType = jobType; }
    public void setLocation(String location) { this.location = location; }
    public void setSector(String sector) { this.sector = sector; }
    public void setCtcMin(Double ctcMin) { this.ctcMin = ctcMin; }
    public void setCtcMax(Double ctcMax) { this.ctcMax = ctcMax; }
    public void setOpenings(Integer openings) { this.openings = openings; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }
    public void setStatus(JobStatus status) { this.status = status; }
    public void setPostedAt(LocalDateTime postedAt) { this.postedAt = postedAt; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private Company company; private String title; private String description;
        private String requiredSkills; private String jobType; private String location; private String sector;
        private Double ctcMin; private Double ctcMax; private Integer openings;
        private LocalDate applicationDeadline; private Double minCgpa;
        private JobStatus status; private LocalDateTime postedAt;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder company(Company company) { this.company = company; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder requiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public Builder jobType(String jobType) { this.jobType = jobType; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder sector(String sector) { this.sector = sector; return this; }
        public Builder ctcMin(Double ctcMin) { this.ctcMin = ctcMin; return this; }
        public Builder ctcMax(Double ctcMax) { this.ctcMax = ctcMax; return this; }
        public Builder openings(Integer openings) { this.openings = openings; return this; }
        public Builder applicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; return this; }
        public Builder minCgpa(Double minCgpa) { this.minCgpa = minCgpa; return this; }
        public Builder status(JobStatus status) { this.status = status; return this; }
        public Builder postedAt(LocalDateTime postedAt) { this.postedAt = postedAt; return this; }
        public JobPosting build() {
            JobPosting j = new JobPosting(); j.id = id; j.company = company; j.title = title;
            j.description = description; j.requiredSkills = requiredSkills; j.jobType = jobType;
            j.location = location; j.sector = sector; j.ctcMin = ctcMin; j.ctcMax = ctcMax; j.openings = openings;
            j.applicationDeadline = applicationDeadline; j.minCgpa = minCgpa;
            j.status = status; j.postedAt = postedAt; return j;
        }
    }
}
