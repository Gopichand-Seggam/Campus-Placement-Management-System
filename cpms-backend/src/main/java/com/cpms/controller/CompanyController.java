package com.cpms.controller;

import com.cpms.model.Company;
import com.cpms.model.User;
import com.cpms.repository.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @GetMapping("/profile")
    public ResponseEntity<Company> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Company profile not found"))
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<Company> updateProfile(@AuthenticationPrincipal User user,
                                                  @RequestBody Company update) {
        var company = companyRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Company profile not found"));
        company.setCompanyName(update.getCompanyName());
        company.setIndustry(update.getIndustry());
        company.setWebsite(update.getWebsite());
        company.setLocation(update.getLocation());
        company.setDescription(update.getDescription());
        company.setPhone(update.getPhone());
        return ResponseEntity.ok(companyRepository.save(company));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
            companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"))
        );
    }
}
