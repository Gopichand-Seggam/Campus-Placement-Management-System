package com.cpms.controller;

import com.cpms.model.Application;
import com.cpms.model.Interview;
import com.cpms.model.User;
import com.cpms.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> apply(@AuthenticationPrincipal User user,
                                             @PathVariable Long jobId,
                                             @RequestBody(required = false) Map<String, String> body) {
        String coverLetter = body != null ? body.get("coverLetter") : null;
        return ResponseEntity.ok(applicationService.apply(user.getId(), jobId, coverLetter));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Application>> myApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getByStudent(user.getId()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> byJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getByJob(jobId));
    }

    @PutMapping("/{appId}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long appId,
                                                     @RequestBody Map<String, String> body) {
        var status = Application.ApplicationStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(applicationService.updateStatus(appId, status));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        return ResponseEntity.ok(applicationService.getStats());
    }

    @PostMapping("/{appId}/interview")
    public ResponseEntity<Interview> scheduleInterview(@PathVariable Long appId,
                                                       @RequestBody Interview interview) {
        return ResponseEntity.ok(applicationService.scheduleInterview(appId, interview));
    }

    @GetMapping("/interviews/my")
    public ResponseEntity<List<Interview>> myInterviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getInterviewsByStudent(user.getId()));
    }
}
