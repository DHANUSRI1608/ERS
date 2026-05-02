package com.ers.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "department_reports")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DepartmentReport {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String department;

    @Column(name = "metric_name", nullable = false)
    private String metricName;

    @Column(name = "metric_value", nullable = false, precision = 14, scale = 2)
    private BigDecimal metricValue;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "report_month")
    private String reportMonth;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @Builder.Default
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Column(name = "file_name")
    private String fileName;
}
