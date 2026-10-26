package com.cpms.repository;

import com.cpms.model.InterviewExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewExperienceRepository extends JpaRepository<InterviewExperience, Long> {
    List<InterviewExperience> findAllByOrderByCreatedAtDesc();
    List<InterviewExperience> findByCompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(String companyName);
    List<InterviewExperience> findByStudentUserIdOrderByCreatedAtDesc(Long userId);
}
