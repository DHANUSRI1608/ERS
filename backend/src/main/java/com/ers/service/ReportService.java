package com.ers.service;

import com.ers.dto.Dto;
import com.ers.entity.AuditLog;
import com.ers.entity.Report;
import com.ers.repository.AuditLogRepository;
import com.ers.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository repo;
    private final AuditLogRepository logRepo;

    public Page<Report> getAll(Pageable pageable) {
        return repo.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Report getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Report not found: " + id));
    }

    public Report save(Dto.SaveReportRequest req, String createdBy) {
        Report r = Report.builder()
                .name(req.getName())
                .createdBy(createdBy)
                .columns(req.getColumns())
                .groupByField(req.getGroupByField())
                .build();
        Report saved = repo.save(r);
        logRepo.save(AuditLog.builder()
                .userEmail(createdBy).userName(createdBy)
                .action("Created report: " + r.getName())
                .module("Reports").status(AuditLog.LogStatus.SUCCESS).build());
        return saved;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    @org.springframework.scheduling.annotation.Async
    public void runReportAsync(Long reportId, String requestedBy) {
        try {
            // Simulate heavy data aggregation processing
            Thread.sleep(5000);
            
            // Save success audit log simulating the end of background job
            logRepo.save(AuditLog.builder()
                .userEmail(requestedBy).userName(requestedBy)
                .action("Background report generation completed for Report ID: " + reportId)
                .module("Reports").status(AuditLog.LogStatus.SUCCESS).build());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}