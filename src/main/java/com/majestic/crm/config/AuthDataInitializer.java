package com.majestic.crm.config;

import com.majestic.crm.entity.Role;
import com.majestic.crm.entity.User;
import com.majestic.crm.repository.RoleRepository;
import com.majestic.crm.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class AuthDataInitializer {

    private static final String ADMIN_EMAIL = "admin@majestic.com";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Bean
    CommandLineRunner seedAuthData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            for (String roleName : List.of("ADMIN", "MANAGER", "SALES", "SUPPORT")) {
                roleRepository.findByName(roleName)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
            }

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ADMIN role was not created"));

            User admin = userRepository.findByEmail(ADMIN_EMAIL)
                    .orElseGet(() -> User.builder()
                            .fullName("Admin User")
                            .email(ADMIN_EMAIL)
                            .phone("9999999999")
                            .build());

            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole(adminRole);
            admin.setActive(true);
            userRepository.save(admin);
        };
    }
}
