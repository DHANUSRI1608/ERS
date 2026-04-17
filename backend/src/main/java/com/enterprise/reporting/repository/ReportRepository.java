package com.enterprise.reporting.repository;

import com.enterprise.reporting.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
