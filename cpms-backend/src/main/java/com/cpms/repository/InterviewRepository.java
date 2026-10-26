package com.cpms.repository;

import com.cpms.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    Optional<Interview> findByApplicationId(Long applicationId);

    @Query("SELECT i FROM Interview i WHERE i.application.student.id = :studentId")
    List<Interview> findByStudentId(Long studentId);

    @Query("SELECT i FROM Interview i WHERE i.application.job.company.id = :companyId")
    List<Interview> findByCompanyId(Long companyId);
}
