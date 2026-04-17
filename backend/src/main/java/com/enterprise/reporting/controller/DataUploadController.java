package com.enterprise.reporting.controller;

import com.enterprise.reporting.model.UploadedData;
import com.enterprise.reporting.service.DataUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class DataUploadController {

    private final DataUploadService uploadService;

    @PostMapping
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {
        try {
            UploadedData data = uploadService.uploadData(file, username);
            return ResponseEntity.ok(java.util.Map.of(
                "status", "success",
                "message", "File uploaded successfully",
                "data", data
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(java.util.Map.of(
                "status", "error",
                "message", "Error processing file: " + e.getMessage()
            ));
        }
    }

    @GetMapping
    public List<UploadedData> getUploads() {
        return uploadService.getAllUploads();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUpload(@PathVariable Long id) {
        uploadService.deleteUpload(id);
        return ResponseEntity.noContent().build();
    }
}
