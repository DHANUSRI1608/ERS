package com.ers.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Report {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(columnDefinition = "TEXT")
    private String columns;

    @Column(name = "group_by_field")
    private String groupByField;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}