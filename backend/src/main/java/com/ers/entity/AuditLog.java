package com.ers.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "user_name")
    private String userName;

    @Column(nullable = false)
    private String action;

    private String module;

    @Column(name = "ip_address")
    private String ipAddress;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LogStatus status = LogStatus.SUCCESS;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum LogStatus { SUCCESS, FAILED }
}