package com.cpms.service;

import com.cpms.dto.AuthDTO;
import com.cpms.model.Student;
import com.cpms.model.Company;
import com.cpms.model.User;
import com.cpms.repository.CompanyRepository;
import com.cpms.repository.StudentRepository;
import com.cpms.repository.UserRepository;
import com.cpms.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository,
                       CompanyRepository companyRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : User.Role.STUDENT)
                .build();
        user = userRepository.save(user);

        if (user.getRole() == User.Role.STUDENT) {
            studentRepository.save(Student.builder()
                    .user(user)
                    .college(request.getCollege())
                    .branch(request.getBranch())
                    .cgpa(request.getCgpa())
                    .skills(request.getSkills())
                    .graduationYear(request.getGraduationYear())
                    .phone(request.getPhone())
                    .linkedinUrl(request.getLinkedinUrl())
                    .githubUrl(request.getGithubUrl())
                    .build());
        } else if (user.getRole() == User.Role.COMPANY) {
            companyRepository.save(Company.builder()
                    .user(user)
                    .companyName(request.getCompanyName() != null ? request.getCompanyName() : request.getName())
                    .industry(request.getIndustry())
                    .website(request.getWebsite())
                    .location(request.getLocation())
                    .description(request.getDescription())
                    .phone(request.getPhone())
                    .build());
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthDTO.AuthResponse(token, user.getRole().name(), user.getId(), user.getName(), user.getEmail());
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthDTO.AuthResponse(token, user.getRole().name(), user.getId(), user.getName(), user.getEmail());
    }
}
