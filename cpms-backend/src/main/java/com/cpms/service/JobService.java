package com.cpms.service;

import com.cpms.model.JobPosting;
import com.cpms.repository.CompanyRepository;
import com.cpms.repository.JobPostingRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    private final JobPostingRepository jobPostingRepository;
    private final CompanyRepository companyRepository;

    public JobService(JobPostingRepository jobPostingRepository, CompanyRepository companyRepository) {
        this.jobPostingRepository = jobPostingRepository;
        this.companyRepository = companyRepository;
    }

    public List<JobPosting> getAllActiveJobs() {
        return jobPostingRepository.findByStatus(JobPosting.JobStatus.ACTIVE);
    }

    public List<JobPosting> searchJobs(String title, String jobType) {
        return jobPostingRepository.searchJobs(title, jobType);
    }

    public List<JobPosting> getJobsByCompany(Long userId) {
        var company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company profile not found"));
        return jobPostingRepository.findByCompanyId(company.getId());
    }

    public JobPosting getJobById(Long id) {
        return jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public JobPosting createJob(Long userId, JobPosting job) {
        var company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Company profile not found"));
        job.setCompany(company);
        return jobPostingRepository.save(job);
    }

    public JobPosting updateJob(Long id, JobPosting updated) {
        var job = getJobById(id);
        job.setTitle(updated.getTitle());
        job.setDescription(updated.getDescription());
        job.setRequiredSkills(updated.getRequiredSkills());
        job.setJobType(updated.getJobType());
        job.setLocation(updated.getLocation());
        job.setSector(updated.getSector());
        job.setCtcMin(updated.getCtcMin());
        job.setCtcMax(updated.getCtcMax());
        job.setOpenings(updated.getOpenings());
        job.setApplicationDeadline(updated.getApplicationDeadline());
        job.setMinCgpa(updated.getMinCgpa());
        job.setStatus(updated.getStatus());
        return jobPostingRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobPostingRepository.deleteById(id);
    }

    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAll();
    }
}
