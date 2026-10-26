package com.cpms.controller;

import com.cpms.model.Company;
import com.cpms.model.CompanyReview;
import com.cpms.model.Student;
import com.cpms.model.User;
import com.cpms.repository.CompanyRepository;
import com.cpms.repository.CompanyReviewRepository;
import com.cpms.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final CompanyReviewRepository reviewRepository;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;

    public ReviewController(CompanyReviewRepository reviewRepository,
                            CompanyRepository companyRepository,
                            StudentRepository studentRepository) {
        this.reviewRepository = reviewRepository;
        this.companyRepository = companyRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<Map<String, Object>> getCompanyReviews(@PathVariable Long companyId) {
        List<CompanyReview> reviews = reviewRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
        Double avg = reviewRepository.avgRatingByCompanyId(companyId);
        return ResponseEntity.ok(Map.of(
            "reviews", reviews,
            "averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0,
            "total", reviews.size()
        ));
    }

    @PostMapping
    public ResponseEntity<CompanyReview> submitReview(
            @RequestBody Map<String, Object> body,
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user) {

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        Company company = companyRepository.findById(Long.parseLong(body.get("companyId").toString()))
                .orElseThrow(() -> new RuntimeException("Company not found"));

        CompanyReview review = new CompanyReview();
        review.setStudent(student);
        review.setCompany(company);
        review.setRating(Integer.parseInt(body.get("rating").toString()));
        review.setReviewText((String) body.get("reviewText"));
        review.setJobRole((String) body.get("jobRole"));
        if (body.get("difficulty") != null) {
            review.setDifficulty(CompanyReview.Difficulty.valueOf((String) body.get("difficulty")));
        }
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/my")
    public ResponseEntity<List<CompanyReview>> getMyReviews(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reviewRepository.findByStudentUserIdOrderByCreatedAtDesc(user.getId()));
    }
}
