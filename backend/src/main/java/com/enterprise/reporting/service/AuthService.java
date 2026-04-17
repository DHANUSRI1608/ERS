package com.enterprise.reporting.service;

import com.enterprise.reporting.model.Role;
import com.enterprise.reporting.model.User;
import com.enterprise.reporting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@enterprise.com")
                .role(Role.ADMIN)
                .status("ACTIVE")
                .build());
        }
        if (userRepository.findByUsername("analyst").isEmpty()) {
            userRepository.save(User.builder()
                .username("analyst")
                .password(passwordEncoder.encode("analyst123"))
                .email("analyst@enterprise.com")
                .role(Role.ANALYST)
                .status("ACTIVE")
                .build());
        }
        if (userRepository.findByUsername("employee").isEmpty()) {
            userRepository.save(User.builder()
                .username("employee")
                .password(passwordEncoder.encode("employee123"))
                .email("employee@enterprise.com")
                .role(Role.EMPLOYEE)
                .status("ACTIVE")
                .build());
        }
    }

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
            .map(user -> passwordEncoder.matches(password, user.getPassword()))
            .orElse(false);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
