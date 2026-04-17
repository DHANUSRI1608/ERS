package com.ers.repository;
import com.ers.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findAllByOrderByCreatedAtDesc(Pageable pageable);
}