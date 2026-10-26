package com.cpms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String college;
    private String branch;
    private Double cgpa;
    private String skills;
    private String resumeUrl;
    private String phone;
    private String linkedinUrl;
    private String githubUrl;
    private Integer graduationYear;

    // Constructors
    public Student() {}

    // Getters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getCollege() { return college; }
    public String getBranch() { return branch; }
    public Double getCgpa() { return cgpa; }
    public String getSkills() { return skills; }
    public String getResumeUrl() { return resumeUrl; }
    public String getPhone() { return phone; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public String getGithubUrl() { return githubUrl; }
    public Integer getGraduationYear() { return graduationYear; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setCollege(String college) { this.college = college; }
    public void setBranch(String branch) { this.branch = branch; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private String college; private String branch;
        private Double cgpa; private String skills; private String resumeUrl;
        private String phone; private String linkedinUrl; private String githubUrl;
        private Integer graduationYear;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder college(String college) { this.college = college; return this; }
        public Builder branch(String branch) { this.branch = branch; return this; }
        public Builder cgpa(Double cgpa) { this.cgpa = cgpa; return this; }
        public Builder skills(String skills) { this.skills = skills; return this; }
        public Builder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public Builder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public Builder graduationYear(Integer graduationYear) { this.graduationYear = graduationYear; return this; }
        public Student build() {
            Student s = new Student(); s.id = id; s.user = user; s.college = college;
            s.branch = branch; s.cgpa = cgpa; s.skills = skills; s.resumeUrl = resumeUrl;
            s.phone = phone; s.linkedinUrl = linkedinUrl; s.githubUrl = githubUrl;
            s.graduationYear = graduationYear; return s;
        }
    }
}
