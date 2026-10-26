package com.cpms.controller;

import com.cpms.model.InterviewExperience;
import com.cpms.model.Student;
import com.cpms.model.User;
import com.cpms.repository.InterviewExperienceRepository;
import com.cpms.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final InterviewExperienceRepository experienceRepository;
    private final StudentRepository studentRepository;

    public ExperienceController(InterviewExperienceRepository experienceRepository,
                                StudentRepository studentRepository) {
        this.experienceRepository = experienceRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public ResponseEntity<List<InterviewExperience>> getAll(
            @RequestParam(required = false) String company) {
        if (company != null && !company.isBlank()) {
            return ResponseEntity.ok(experienceRepository
                    .findByCompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(company));
        }
        return ResponseEntity.ok(experienceRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<InterviewExperience> share(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        InterviewExperience exp = new InterviewExperience();
        exp.setStudent(student);
        exp.setCompanyName((String) body.get("companyName"));
        exp.setJobRole((String) body.get("jobRole"));
        exp.setQuestionsAsked((String) body.get("questionsAsked"));
        exp.setTips((String) body.get("tips"));
        if (body.get("outcome") != null)
            exp.setOutcome(InterviewExperience.Outcome.valueOf((String) body.get("outcome")));
        if (body.get("difficulty") != null)
            exp.setDifficulty(InterviewExperience.Difficulty.valueOf((String) body.get("difficulty")));
        if (body.get("offerReceived") != null)
            exp.setOfferReceived(Boolean.parseBoolean(body.get("offerReceived").toString()));
        return ResponseEntity.ok(experienceRepository.save(exp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        experienceRepository.findById(id).ifPresent(exp -> {
            if (exp.getStudent().getUser().getId().equals(user.getId()))
                experienceRepository.delete(exp);
        });
        return ResponseEntity.noContent().build();
    }
}
