package com.enterprise.reporting.service;

import com.enterprise.reporting.model.AuditLog;
import com.enterprise.reporting.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(Long userId, String username, String action, String details) {
        auditLogRepository.save(AuditLog.builder()
            .userId(userId)
            .username(username)
            .action(action)
            .details(details)
            .timestamp(LocalDateTime.now())
            .build());
    }
}
