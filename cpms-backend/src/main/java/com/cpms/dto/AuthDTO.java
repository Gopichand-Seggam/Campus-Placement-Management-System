package com.cpms.dto;

import com.cpms.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    public static class RegisterRequest {
        // Common fields
        @NotBlank private String name;
        @Email @NotBlank private String email;
        @Size(min = 6) private String password;
        private User.Role role;

        // Student-specific fields
        private String college;
        private String branch;
        private Double cgpa;
        private String skills;
        private Integer graduationYear;
        private String phone;
        private String linkedinUrl;
        private String githubUrl;

        // Company/Recruiter-specific fields
        private String companyName;
        private String industry;
        private String website;
        private String location;
        private String description;

        // Getters
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public User.Role getRole() { return role; }
        public String getCollege() { return college; }
        public String getBranch() { return branch; }
        public Double getCgpa() { return cgpa; }
        public String getSkills() { return skills; }
        public Integer getGraduationYear() { return graduationYear; }
        public String getPhone() { return phone; }
        public String getLinkedinUrl() { return linkedinUrl; }
        public String getGithubUrl() { return githubUrl; }
        public String getCompanyName() { return companyName; }
        public String getIndustry() { return industry; }
        public String getWebsite() { return website; }
        public String getLocation() { return location; }
        public String getDescription() { return description; }

        // Setters
        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
        public void setRole(User.Role role) { this.role = role; }
        public void setCollege(String college) { this.college = college; }
        public void setBranch(String branch) { this.branch = branch; }
        public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
        public void setSkills(String skills) { this.skills = skills; }
        public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
        public void setPhone(String phone) { this.phone = phone; }
        public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
        public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public void setIndustry(String industry) { this.industry = industry; }
        public void setWebsite(String website) { this.website = website; }
        public void setLocation(String location) { this.location = location; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;

        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public void setEmail(String email) { this.email = email; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String role;
        private Long userId;
        private String name;
        private String email;

        public AuthResponse(String token, String role, Long userId, String name, String email) {
            this.token = token; this.role = role; this.userId = userId;
            this.name = name; this.email = email;
        }

        public String getToken() { return token; }
        public String getRole() { return role; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
    }
}
