package com.cpms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String companyName;

    private String industry;
    private String website;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String logoUrl;
    private String phone;

    // Constructors
    public Company() {}

    // Getters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getCompanyName() { return companyName; }
    public String getIndustry() { return industry; }
    public String getWebsite() { return website; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public String getLogoUrl() { return logoUrl; }
    public String getPhone() { return phone; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setIndustry(String industry) { this.industry = industry; }
    public void setWebsite(String website) { this.website = website; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public void setPhone(String phone) { this.phone = phone; }

    // Builder
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id; private User user; private String companyName;
        private String industry; private String website; private String location;
        private String description; private String logoUrl; private String phone;
        public Builder id(Long id) { this.id = id; return this; }
        public Builder user(User user) { this.user = user; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder industry(String industry) { this.industry = industry; return this; }
        public Builder website(String website) { this.website = website; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Company build() {
            Company c = new Company(); c.id = id; c.user = user; c.companyName = companyName;
            c.industry = industry; c.website = website; c.location = location;
            c.description = description; c.logoUrl = logoUrl; c.phone = phone; return c;
        }
    }
}
