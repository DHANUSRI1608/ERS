package com.ers.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Performance performance = Performance.GOOD;

    @Column(name = "uploaded_by")
    private String uploadedBy;

    @Builder.Default
    @Column(name = "uploaded_at")
    private LocalDate uploadedAt = LocalDate.now();

    public enum Status { ACTIVE, INACTIVE }
    public enum Performance { EXCELLENT, GOOD, AVERAGE, BELOW_AVERAGE }
}