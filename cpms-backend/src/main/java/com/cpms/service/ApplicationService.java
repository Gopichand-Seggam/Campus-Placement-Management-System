package com.cpms.service;

import com.cpms.model.Application;
import com.cpms.model.Interview;
import com.cpms.repository.ApplicationRepository;
import com.cpms.repository.InterviewRepository;
import com.cpms.repository.JobPostingRepository;
import com.cpms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobPostingRepository jobPostingRepository;
    private final InterviewRepository interviewRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                               StudentRepository studentRepository,
                               JobPostingRepository jobPostingRepository,
                               InterviewRepository interviewRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobPostingRepository = jobPostingRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional
    public Application apply(Long userId, Long jobId, String coverLetter) {
        var student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
        var job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (applicationRepository.findByStudentIdAndJobId(student.getId(), jobId).isPresent()) {
            throw new RuntimeException("Already applied to this job");
        }
        var app = Application.builder()
                .student(student)
                .job(job)
                .coverLetter(coverLetter)
                .build();
        return applicationRepository.save(app);
    }

    public List<Application> getByStudent(Long userId) {
        var student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return applicationRepository.findByStudentId(student.getId());
    }

    public List<Application> getByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application updateStatus(Long appId, Application.ApplicationStatus status) {
        var app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    public Map<String, Long> getStats() {
        return Map.of(
                "total", applicationRepository.count(),
                "shortlisted", applicationRepository.countByStatus(Application.ApplicationStatus.SHORTLISTED),
                "offered", applicationRepository.countByStatus(Application.ApplicationStatus.OFFERED),
                "rejected", applicationRepository.countByStatus(Application.ApplicationStatus.REJECTED)
        );
    }

    public Interview scheduleInterview(Long appId, Interview interview) {
        var app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        interview.setApplication(app);
        if (interview.getResult() == null) interview.setResult(Interview.InterviewResult.PENDING);
        app.setStatus(Application.ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(app);
        return interviewRepository.save(interview);
    }

    public List<Interview> getInterviewsByStudent(Long userId) {
        var student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return interviewRepository.findByStudentId(student.getId());
    }
}
