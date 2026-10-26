package com.cpms.controller;

import com.cpms.model.User;
import com.cpms.repository.ApplicationRepository;
import com.cpms.repository.CompanyRepository;
import com.cpms.repository.JobPostingRepository;
import com.cpms.repository.StudentRepository;
import com.cpms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobPostingRepository jobPostingRepository;
    private final ApplicationRepository applicationRepository;

    public AdminController(UserRepository userRepository,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository,
                           JobPostingRepository jobPostingRepository,
                           ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports/summary")
    public ResponseEntity<Map<String, Object>> getReportSummary() {
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalJobs = jobPostingRepository.count();
        long totalApplications = applicationRepository.count();
        long offered = applicationRepository.countByStatus(
            com.cpms.model.Application.ApplicationStatus.OFFERED);
        long shortlisted = applicationRepository.countByStatus(
            com.cpms.model.Application.ApplicationStatus.SHORTLISTED);
        long rejected = applicationRepository.countByStatus(
            com.cpms.model.Application.ApplicationStatus.REJECTED);
        long interviewScheduled = applicationRepository.countByStatus(
            com.cpms.model.Application.ApplicationStatus.INTERVIEW_SCHEDULED);

        double placementRate = totalStudents > 0
            ? Math.round((offered * 100.0) / totalStudents * 10) / 10.0
            : 0;

        return ResponseEntity.ok(Map.of(
            "totalStudents", totalStudents,
            "totalCompanies", totalCompanies,
            "totalJobs", totalJobs,
            "totalApplications", totalApplications,
            "offered", offered,
            "shortlisted", shortlisted,
            "rejected", rejected,
            "interviewScheduled", interviewScheduled,
            "placementRate", placementRate
        ));
    }
}
