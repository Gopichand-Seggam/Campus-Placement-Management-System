package com.cpms.repository;

import com.cpms.model.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByCompanyId(Long companyId);
    List<JobPosting> findByStatus(JobPosting.JobStatus status);

    @Query("SELECT j FROM JobPosting j WHERE j.status = 'ACTIVE' AND " +
           "(:title IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType)")
    List<JobPosting> searchJobs(String title, String jobType);
}
