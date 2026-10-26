package com.cpms.repository;

import com.cpms.model.CompanyReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CompanyReviewRepository extends JpaRepository<CompanyReview, Long> {
    List<CompanyReview> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<CompanyReview> findByStudentUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT AVG(r.rating) FROM CompanyReview r WHERE r.company.id = :companyId")
    Double avgRatingByCompanyId(Long companyId);
}
