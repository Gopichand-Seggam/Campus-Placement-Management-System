package com.cpms.controller;

import com.cpms.model.JobPosting;
import com.cpms.model.Student;
import com.cpms.model.User;
import com.cpms.repository.JobPostingRepository;
import com.cpms.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class PortfolioController {

    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;

    public PortfolioController(StudentRepository studentRepository,
                               JobPostingRepository jobPostingRepository) {
        this.studentRepository = studentRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    // ── Public portfolio endpoint — no auth required ─────────────────────────
    @GetMapping("/portfolio/{userId}")
    public ResponseEntity<Map<String, Object>> getPortfolio(@PathVariable Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        Map<String, Object> portfolio = new LinkedHashMap<>();
        portfolio.put("name", student.getUser().getName());
        portfolio.put("email", student.getUser().getEmail());
        portfolio.put("college", student.getCollege());
        portfolio.put("branch", student.getBranch());
        portfolio.put("cgpa", student.getCgpa());
        portfolio.put("graduationYear", student.getGraduationYear());
        portfolio.put("skills", student.getSkills());
        portfolio.put("linkedInUrl", student.getLinkedinUrl());
        portfolio.put("githubUrl", student.getGithubUrl());
        portfolio.put("phone", student.getPhone());
        portfolio.put("resumeUrl", student.getResumeUrl());
        return ResponseEntity.ok(portfolio);
    }

    // ── Smart Job Recommendations ─────────────────────────────────────────────
    @GetMapping("/jobs/recommended")
    public ResponseEntity<List<Map<String, Object>>> getRecommendedJobs(@AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId()).orElse(null);
        if (student == null || student.getSkills() == null) return ResponseEntity.ok(List.of());

        Set<String> studentSkills = Arrays.stream(student.getSkills().split(","))
                .map(s -> s.trim().toLowerCase())
                .collect(Collectors.toSet());

        List<JobPosting> allJobs = jobPostingRepository.findAll().stream()
                .filter(j -> j.getStatus() == JobPosting.JobStatus.ACTIVE)
                .toList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (JobPosting job : allJobs) {
            if (job.getRequiredSkills() == null) continue;
            Set<String> jobSkills = Arrays.stream(job.getRequiredSkills().split(","))
                    .map(s -> s.trim().toLowerCase())
                    .collect(Collectors.toSet());
            long matched = studentSkills.stream().filter(jobSkills::contains).count();
            if (jobSkills.isEmpty()) continue;
            double score = (matched * 100.0) / jobSkills.size();
            if (score >= 30) { // at least 30% skill match
                Map<String, Object> rec = new LinkedHashMap<>(Map.of(
                    "id", job.getId(),
                    "title", job.getTitle(),
                    "companyName", job.getCompany() != null ? job.getCompany().getCompanyName() : "Unknown",
                    "location", job.getLocation() != null ? job.getLocation() : "",
                    "jobType", job.getJobType() != null ? job.getJobType() : "",
                    "matchScore", (int) score,
                    "matchedSkills", matched,
                    "totalSkills", (long) jobSkills.size()
                ));
                result.add(rec);
            }
        }
        result.sort(Comparator.comparingDouble(m -> -((Number) m.get("matchScore")).doubleValue()));
        return ResponseEntity.ok(result.stream().limit(6).toList());
    }

    // ── Skill Gap Analysis ────────────────────────────────────────────────────
    @GetMapping("/jobs/{jobId}/skill-gap")
    public ResponseEntity<Map<String, Object>> getSkillGap(@PathVariable Long jobId,
                                                            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Set<String> studentSkills = student.getSkills() != null
                ? Arrays.stream(student.getSkills().split(",")).map(s -> s.trim().toLowerCase()).collect(Collectors.toSet())
                : new HashSet<>();
        Set<String> jobSkills = job.getRequiredSkills() != null
                ? Arrays.stream(job.getRequiredSkills().split(",")).map(s -> s.trim().toLowerCase()).collect(Collectors.toSet())
                : new HashSet<>();

        Set<String> matched = new HashSet<>(studentSkills);
        matched.retainAll(jobSkills);
        Set<String> missing = new HashSet<>(jobSkills);
        missing.removeAll(studentSkills);

        double matchPct = jobSkills.isEmpty() ? 100 : (matched.size() * 100.0) / jobSkills.size();

        return ResponseEntity.ok(Map.of(
            "jobTitle", job.getTitle(),
            "companyName", job.getCompany() != null ? job.getCompany().getCompanyName() : "",
            "matchPercentage", (int) matchPct,
            "matchedSkills", matched,
            "missingSkills", missing,
            "yourSkills", studentSkills
        ));
    }

    // ── Student Skill Ranking (Admin/Company) ──────────────────────────────
    @GetMapping("/students/ranking")
    public ResponseEntity<List<Map<String, Object>>> getStudentRanking() {
        List<Student> students = studentRepository.findAll();
        List<Map<String, Object>> ranking = new ArrayList<>();
        for (Student s : students) {
            int skillCount = s.getSkills() != null && !s.getSkills().isBlank()
                    ? s.getSkills().split(",").length : 0;
            double cgpa = s.getCgpa() != null ? s.getCgpa() : 0.0;
            double score = (skillCount * 5.0) + (cgpa * 10.0);
            ranking.add(new HashMap<>(Map.of(
                "id", s.getId(),
                "userId", s.getUser().getId(),
                "name", s.getUser().getName(),
                "email", s.getUser().getEmail(),
                "college", s.getCollege() != null ? s.getCollege() : "",
                "branch", s.getBranch() != null ? s.getBranch() : "",
                "cgpa", cgpa,
                "skills", s.getSkills() != null ? s.getSkills() : "",
                "skillCount", skillCount,
                "score", Math.round(score * 10.0) / 10.0
            )));
        }
        ranking.sort(Comparator.comparingDouble(m -> -((Number) m.get("score")).doubleValue()));
        for (int i = 0; i < ranking.size(); i++) {
            ((Map<String, Object>) ranking.get(i)).put("rank", i + 1);
        }
        return ResponseEntity.ok(ranking);
    }
}
