package com.cpms.repository;

import com.cpms.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJobId(Long jobId);
    Optional<Application> findByStudentIdAndJobId(Long studentId, Long jobId);
    long countByJobId(Long jobId);
    long countByStatus(Application.ApplicationStatus status);
}
