package com.cpms.config;

import com.cpms.model.User;
import com.cpms.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Always ensures the default admin account exists with the correct password.
 * On every startup it resets admin@cpms.com to password "admin123"
 * so a bad SQL-inserted hash never blocks login.
 */
@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        User admin = userRepository.findByEmail("admin@cpms.com").orElse(null);

        if (admin == null) {
            admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@cpms.com");
            admin.setRole(User.Role.ADMIN);
        }

        // Always reset the password so a bad hash never blocks login
        admin.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(admin);

        System.out.println("========================================");
        System.out.println("[CPMS] Admin account ready:");
        System.out.println("       Email   : admin@cpms.com");
        System.out.println("       Password: admin123");
        System.out.println("========================================");
    }
}
