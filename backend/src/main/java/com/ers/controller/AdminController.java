package com.ers.controller;

import com.ers.dto.Dto;
import com.ers.entity.AuditLog;
import com.ers.entity.User;
import com.ers.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody Dto.CreateUserRequest req) {
        return ResponseEntity.ok(adminService.createUser(req));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id,
                                            @RequestBody Dto.UpdateRoleRequest req) {
        return ResponseEntity.ok(adminService.updateRole(id, req.getRole()));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/logs")
    public ResponseEntity<Page<AuditLog>> getLogs(Pageable pageable) {
        return ResponseEntity.ok(adminService.getLogs(pageable));
    }

    @GetMapping("/logs/download")
    public ResponseEntity<byte[]> downloadLogs() {
        byte[] csvData = adminService.exportAuditLogsAsCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"audit_logs.csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}