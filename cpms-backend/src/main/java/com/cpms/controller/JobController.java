package com.cpms.controller;

import com.cpms.model.JobPosting;
import com.cpms.model.User;
import com.cpms.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobPosting>> getAllActive() {
        return ResponseEntity.ok(jobService.getAllActiveJobs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobPosting>> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String jobType) {
        return ResponseEntity.ok(jobService.searchJobs(title, jobType));
    }

    @GetMapping("/all")
    public ResponseEntity<List<JobPosting>> getAllAdmin() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPosting> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/company/my")
    public ResponseEntity<List<JobPosting>> getMyJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(jobService.getJobsByCompany(user.getId()));
    }

    @PostMapping
    public ResponseEntity<JobPosting> createJob(@AuthenticationPrincipal User user,
                                                @RequestBody JobPosting job) {
        return ResponseEntity.ok(jobService.createJob(user.getId(), job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobPosting> updateJob(@PathVariable Long id,
                                                @RequestBody JobPosting job) {
        return ResponseEntity.ok(jobService.updateJob(id, job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
