package com.ers.controller;

import com.ers.entity.DepartmentReport;
import com.ers.service.DepartmentReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dept-reports")
@RequiredArgsConstructor
public class DepartmentReportController {

    private final DepartmentReportService service;

    // ── Upload department report ────────────────────────────────────────────
    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        try {
            return ResponseEntity.ok(service.uploadDepartmentReport(file, auth.getName()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // ── Dashboard data (all visualizations) ─────────────────────────────────
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(service.getDashboardStats(department, startDate, endDate));
    }

    // ── Paginated list of all uploaded records ──────────────────────────────
    @GetMapping
    public ResponseEntity<Page<DepartmentReport>> getAll(Pageable pageable) {
        return ResponseEntity.ok(service.getAllReports(pageable));
    }

    // ── Compare specific departments ────────────────────────────────────────
    @GetMapping("/compare")
    public ResponseEntity<Map<String, Object>> compare(
            @RequestParam String departments) {
        List<String> deptList = Arrays.asList(departments.split(","));
        return ResponseEntity.ok(service.compareDepartments(deptList));
    }

    // ── List distinct departments ───────────────────────────────────────────
    @GetMapping("/departments")
    public ResponseEntity<List<String>> getDepartments() {
        return ResponseEntity.ok(service.getDashboardStats(null, null, null)
                .get("departments") instanceof List<?> list
                ? list.stream().map(Object::toString).toList()
                : List.of());
    }

    // ── Upload history (unique files) ───────────────────────────────────────
    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> history() {
        return ResponseEntity.ok(service.getUploadHistory());
    }
}
