package com.ers.controller;

import com.ers.dto.Dto;
import com.ers.entity.Report;
import com.ers.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<Page<Report>> getAll(Pageable pageable) {
        return ResponseEntity.ok(reportService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Report> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<Report> save(@RequestBody Dto.SaveReportRequest req,
                                        Authentication auth) {
        return ResponseEntity.ok(reportService.save(req, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reportService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<java.util.Map<String, String>> runReport(@PathVariable Long id, Authentication auth) {
        reportService.runReportAsync(id, auth.getName());
        return ResponseEntity.accepted().body(java.util.Map.of("status", "Reporting generation started in background"));
    }
}