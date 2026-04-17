package com.ers.service;

import com.ers.dto.Dto;
import com.ers.entity.AuditLog;
import com.ers.entity.User;
import com.ers.repository.AuditLogRepository;
import com.ers.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final AuditLogRepository logRepo;
    private final PasswordEncoder encoder;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User createUser(Dto.CreateUserRequest req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already exists: " + req.getEmail());
        User.Role role;
        try { role = User.Role.valueOf(req.getRole()); }
        catch (Exception e) { role = User.Role.EMPLOYEE; }
        return userRepo.save(User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(encoder.encode(
                        req.getPassword() != null && !req.getPassword().isBlank()
                                ? req.getPassword() : "changeme123"))
                .role(role)
                .department(req.getDepartment())
                .build());
    }

    public User updateRole(Long userId, String role) {
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        u.setRole(User.Role.valueOf(role));
        return userRepo.save(u);
    }

    public void deleteUser(Long userId) {
        userRepo.deleteById(userId);
    }

    public Page<AuditLog> getLogs(Pageable pageable) {
        return logRepo.findAllByOrderByTimestampDesc(pageable);
    }

    public byte[] exportAuditLogsAsCsv() {
        List<AuditLog> all = logRepo.findAll();
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        pw.println("Id,Email,Name,Action,Module,IP,Status,Timestamp");
        for (AuditLog log : all) {
            pw.printf("%d,%s,%s,\"%s\",\"%s\",%s,%s,%s\n",
                    log.getId(),
                    log.getUserEmail() != null ? log.getUserEmail() : "",
                    log.getUserName() != null ? log.getUserName() : "",
                    log.getAction() != null ? log.getAction().replace("\"", "\"\"") : "",
                    log.getModule() != null ? log.getModule() : "",
                    log.getIpAddress() != null ? log.getIpAddress() : "",
                    log.getStatus(),
                    log.getTimestamp() != null ? log.getTimestamp().toString() : ""
            );
        }
        return sw.toString().getBytes();
    }
}