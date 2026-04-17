package com.enterprise.reporting.service;

import com.enterprise.reporting.model.UploadedData;
import com.enterprise.reporting.repository.UploadedDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataUploadService {

    private final UploadedDataRepository dataRepository;

    public UploadedData uploadData(MultipartFile file, String username) throws Exception {
        String content = new String(file.getBytes());
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();
        
        String columns = "";
        long recordCount = 0;

        if (filename != null && filename.endsWith(".csv")) {
            try (com.opencsv.CSVReader reader = new com.opencsv.CSVReader(new java.io.StringReader(content))) {
                String[] headers = reader.readNext();
                if (headers != null) {
                    columns = String.join(",", headers);
                    // Count remaining lines
                    while (reader.readNext() != null) {
                        recordCount++;
                    }
                }
            }
        } else {
            // Basic line counting for non-CSV (simulation)
            recordCount = content.lines().count() - 1; // Assuming header
        }
        
        UploadedData data = UploadedData.builder()
            .filename(filename)
            .contentType(contentType)
            .size(file.getSize())
            .content(content)
            .recordCount(recordCount)
            .columns(columns)
            .uploadTime(LocalDateTime.now())
            .uploadedBy(username)
            .build();
            
        return dataRepository.save(data);
    }

    public List<UploadedData> getAllUploads() {
        return dataRepository.findAll();
    }

    public void deleteUpload(Long id) {
        dataRepository.deleteById(id);
    }
}
