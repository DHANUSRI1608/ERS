package com.ers.service;

import com.ers.entity.AuditLog;
import com.ers.entity.Employee;
import com.ers.repository.AuditLogRepository;
import com.ers.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository empRepo;
    private final AuditLogRepository logRepo;

    private static final Set<String> VALID_DEPTS =
            Set.of("Sales","Engineering","Marketing","Finance","HR","Operations");

    public Page<Employee> getAll(Pageable pageable) {
        return empRepo.findAll(pageable);
    }

    @Cacheable("dashboardStats")
    public Map<String, Object> getDashboardStats() {
        long total  = empRepo.count();
        long active = empRepo.countActive();
        Double totalSal = empRepo.getTotalSalaryOfActive();
        double avg  = (active > 0 && totalSal != null) ? totalSal / active : 0;

        List<Map<String, Object>> depts = empRepo.getDepartmentStats().stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("department", row[0]);
            m.put("headcount",  row[1]);
            m.put("totalSalary",row[2]);
            m.put("avgSalary",  row[3]);
            return m;
        }).toList();

        return Map.of(
            "totalEmployees",  total,
            "activeEmployees", active,
            "avgSalary",       Math.round(avg),
            "departments",     depts
        );
    }

    @CacheEvict(value = "dashboardStats", allEntries = true)
    public Map<String, Object> upload(MultipartFile file, String uploadedBy) throws Exception {
        List<Employee> valid  = new ArrayList<>();
        List<Map<String,Object>> errors = new ArrayList<>();
        String name = Objects.requireNonNullElse(file.getOriginalFilename(), "");

        if (name.toLowerCase().endsWith(".csv")) {
            parseCsv(file, valid, errors, uploadedBy);
        } else {
            parseXlsx(file, valid, errors, uploadedBy);
        }

        if (!errors.isEmpty()) {
            return Map.of("success", false, "errors", errors);
        }

        empRepo.saveAll(valid);
        logRepo.save(AuditLog.builder()
                .userEmail(uploadedBy).userName(uploadedBy)
                .action("Uploaded " + valid.size() + " records")
                .module("Ingestion").status(AuditLog.LogStatus.SUCCESS).build());

        return Map.of("success", true, "imported", valid.size(),
                "preview", valid.stream().limit(5).toList());
    }

    // ── CSV parser ────────────────────────────────────────────────────────────
    private void parseCsv(MultipartFile file, List<Employee> valid,
                          List<Map<String,Object>> errors, String by) throws Exception {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            br.readLine(); // skip header
            String line;
            int row = 2;
            while ((line = br.readLine()) != null) {
                if (line.isBlank()) { row++; continue; }
                String[] c = line.split(",", -1);
                processRow(c, row++, valid, errors, by);
            }
        }
    }

    // ── Excel parser ──────────────────────────────────────────────────────────
    private void parseXlsx(MultipartFile file, List<Employee> valid,
                            List<Map<String,Object>> errors, String by) throws Exception {
        try (Workbook wb = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;
            for (Row row : sheet) {
                if (rowNum++ == 0) continue;
                if (row == null) continue;
                String[] c = new String[]{
                    cell(row, 0), cell(row, 1), cell(row, 2), cell(row, 3), cell(row, 4)
                };
                processRow(c, rowNum, valid, errors, by);
            }
        }
    }

    private String cell(Row row, int idx) {
        Cell c = row.getCell(idx);
        if (c == null) return "";
        return switch (c.getCellType()) {
            case NUMERIC -> String.valueOf((long) c.getNumericCellValue());
            case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
            default -> c.getStringCellValue().trim();
        };
    }

    // ── Row validator/builder ─────────────────────────────────────────────────
    private void processRow(String[] c, int row, List<Employee> valid,
                             List<Map<String,Object>> errors, String by) {
        if (c.length < 5) { addErr(errors, row, "row", "Not enough columns (need 5)"); return; }
        String empId = c[0].trim(), name = c[1].trim(),
               dept  = c[2].trim(), salStr = c[3].trim(), dateStr = c[4].trim();

        if (empId.isEmpty())  { addErr(errors, row, "employee_id", "Empty"); return; }
        if (name.isEmpty())   { addErr(errors, row, "name", "Empty"); return; }
        if (dept.isEmpty())   { addErr(errors, row, "department", "Empty"); return; }
        if (!VALID_DEPTS.contains(dept)) {
            addErr(errors, row, "department", "Invalid dept: " + dept
                    + ". Valid: " + String.join(", ", VALID_DEPTS)); return;
        }
        BigDecimal salary;
        try { salary = new BigDecimal(salStr); }
        catch (Exception e) { addErr(errors, row, "salary", "Not a number: " + salStr); return; }

        if (empRepo.existsByEmployeeId(empId)) {
            addErr(errors, row, "employee_id", "Duplicate: " + empId); return;
        }

        LocalDate joinDate = LocalDate.now();
        for (String fmt : new String[]{"yyyy-MM-dd","dd/MM/yyyy","MM/dd/yyyy"}) {
            try { joinDate = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(fmt)); break; }
            catch (DateTimeParseException ignored) {}
        }

        valid.add(Employee.builder()
                .employeeId(empId).name(name).department(dept)
                .salary(salary).joinDate(joinDate).uploadedBy(by).build());
    }

    private void addErr(List<Map<String,Object>> errors, int row, String field, String issue) {
        errors.add(Map.of("row", row, "field", field, "issue", issue));
    }
}