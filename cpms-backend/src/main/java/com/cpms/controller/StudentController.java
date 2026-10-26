package com.cpms.controller;

import com.cpms.model.Student;
import com.cpms.model.User;
import com.cpms.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<Student> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"))
        );
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @PutMapping("/profile")
    public ResponseEntity<Student> updateProfile(@AuthenticationPrincipal User user,
                                                  @RequestBody Student update) {
        var student = studentRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        student.setCollege(update.getCollege());
        student.setBranch(update.getBranch());
        student.setCgpa(update.getCgpa());
        student.setSkills(update.getSkills());
        student.setPhone(update.getPhone());
        student.setLinkedinUrl(update.getLinkedinUrl());
        student.setGithubUrl(update.getGithubUrl());
        student.setGraduationYear(update.getGraduationYear());
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(@AuthenticationPrincipal User user,
                                                             @RequestParam("file") MultipartFile file) throws IOException {
        String uploadDir = "uploads/resumes/";
        Files.createDirectories(Paths.get(uploadDir));
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir + filename);
        Files.write(path, file.getBytes());

        var student = studentRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        student.setResumeUrl("/api/resumes/" + filename);
        studentRepository.save(student);

        return ResponseEntity.ok(Map.of("resumeUrl", "/api/resumes/" + filename));
    }
}
