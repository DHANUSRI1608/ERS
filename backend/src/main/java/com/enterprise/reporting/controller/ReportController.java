package com.enterprise.reporting.controller;

import com.enterprise.reporting.model.Report;
import com.enterprise.reporting.model.User;
import com.enterprise.reporting.service.AuthService;
import com.enterprise.reporting.service.AuditService;
import com.enterprise.reporting.service.ReportService;
import com.lowagie.text.DocumentException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReportController {

    private final ReportService reportService;
    private final AuthService authService;
    private final AuditService auditService;

    @GetMapping("/generate-weekly/pdf")
    public ResponseEntity<byte[]> generateWeeklyPdf(@RequestParam String username) throws DocumentException {
        User user = authService.getUserByUsername(username);
        byte[] data = reportService.generateWeeklyPdf(user);
        
        auditService.logAction(user.getId(), user.getUsername(), "GENERATE_REPORT", "Weekly PDF Report generated");

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=weekly_report.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .body(data);
    }

    @GetMapping("/generate-weekly/excel")
    public ResponseEntity<byte[]> generateWeeklyExcel(@RequestParam String username) throws IOException {
        User user = authService.getUserByUsername(username);
        byte[] data = reportService.generateWeeklyExcel(user);

        auditService.logAction(user.getId(), user.getUsername(), "GENERATE_REPORT", "Weekly Excel Report generated");

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=weekly_report.xlsx")
            .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
            .body(data);
    }

    @GetMapping("/history")
    public List<Report> getHistory() {
        return reportService.getReportHistory();
    }
}
