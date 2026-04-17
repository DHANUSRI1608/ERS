package com.enterprise.reporting.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "uploaded_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadedData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;
    private String contentType;
    private long size;

    @Column(columnDefinition = "LONGTEXT")
    private String content; // Storing as string for demo/simplicity

    private long recordCount;
    
    @Column(columnDefinition = "TEXT")
    private String columns; // Stored as comma-separated or JSON

    private LocalDateTime uploadTime;
    private String uploadedBy;
}
