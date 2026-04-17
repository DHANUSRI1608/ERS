package com.ers.service;

import com.ers.dto.Dto;
import com.ers.entity.AuditLog;
import com.ers.entity.User;
import com.ers.repository.AuditLogRepository;
import com.ers.repository.UserRepository;
import com.ers.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final AuditLogRepository logRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtils jwt;

    public Dto.AuthResponse login(Dto.LoginRequest req, String ip) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User u = userRepo.findByEmail(req.getEmail()).orElseThrow();
        String token = jwt.generateToken(u.getEmail(), u.getRole().name());
        logRepo.save(AuditLog.builder()
                .userEmail(u.getEmail()).userName(u.getName())
                .action("Login").module("Auth").ipAddress(ip)
                .status(AuditLog.LogStatus.SUCCESS).build());
        return new Dto.AuthResponse(token, u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getDepartment());
    }

    public Dto.AuthResponse register(Dto.RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        User.Role role;
        try { role = User.Role.valueOf(req.getRole()); }
        catch (Exception e) { role = User.Role.EMPLOYEE; }
        User u = userRepo.save(User.builder()
                .name(req.getName()).email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .role(role).department(req.getDepartment()).build());
        String token = jwt.generateToken(u.getEmail(), u.getRole().name());
        return new Dto.AuthResponse(token, u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getDepartment());
    }
}