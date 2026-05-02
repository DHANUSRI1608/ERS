package com.ers.service;

import com.ers.entity.AuditLog;
import com.ers.entity.DepartmentReport;
import com.ers.repository.AuditLogRepository;
import com.ers.repository.DepartmentReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentReportService {

    private final DepartmentReportRepository repo;
    private final AuditLogRepository logRepo;

    private static final Set<String> VALID_DEPTS =
            Set.of("Sales", "Engineering", "Marketing", "Finance", "HR", "Operations");

    private static final Set<String> VALID_METRICS =
            Set.of("Revenue", "Expenses", "Headcount", "Satisfaction", "Productivity", "Other");

    // ════════════════════════════════════════════════════════════════════════
    // Upload department report (CSV or Excel)
    // ════════════════════════════════════════════════════════════════════════
    public Map<String, Object> uploadDepartmentReport(MultipartFile file, String uploadedBy) throws Exception {
        List<DepartmentReport> valid = new ArrayList<>();
        List<Map<String, Object>> errors = new ArrayList<>();
        String fileName = Objects.requireNonNullElse(file.getOriginalFilename(), "unknown");

        if (fileName.toLowerCase().endsWith(".csv")) {
            parseCsv(file, valid, errors, uploadedBy, fileName);
        } else {
            parseXlsx(file, valid, errors, uploadedBy, fileName);
        }

        if (!errors.isEmpty()) {
            return Map.of("success", false, "errors", errors);
        }

        repo.saveAll(valid);
        logRepo.save(AuditLog.builder()
                .userEmail(uploadedBy).userName(uploadedBy)
                .action("Uploaded department report: " + fileName + " (" + valid.size() + " records)")
                .module("DeptReport").status(AuditLog.LogStatus.SUCCESS).build());

        log.info("Uploaded {} department report records from {} by {}", valid.size(), fileName, uploadedBy);

        return Map.of("success", true, "imported", valid.size(), "fileName", fileName,
                "preview", valid.stream().limit(5).map(this::toMap).toList());
    }

    private Map<String, Object> toMap(DepartmentReport r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("department", r.getDepartment());
        m.put("metricName", r.getMetricName());
        m.put("metricValue", r.getMetricValue());
        m.put("reportDate", r.getReportDate().toString());
        return m;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Dashboard stats (all visualizations)
    // ════════════════════════════════════════════════════════════════════════
    public Map<String, Object> getDashboardStats(String department, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> result = new LinkedHashMap<>();

        String deptFilter = (department != null && !department.isBlank() && !"All".equals(department)) ? department : null;

        // KPI data
        List<String> departments = repo.findDistinctDepartments();
        Long totalUploads = repo.countDistinctUploads();
        List<Object[]> best = repo.getBestPerforming();
        List<Object[]> worst = repo.getWorstPerforming();

        Map<String, Object> kpi = new LinkedHashMap<>();
        kpi.put("totalDepartments", departments.size());
        kpi.put("totalReports", totalUploads != null ? totalUploads : 0);
        kpi.put("bestDepartment", best.isEmpty() ? "N/A" : best.get(0)[0]);
        kpi.put("bestScore", best.isEmpty() ? 0 : best.get(0)[1]);
        kpi.put("worstDepartment", worst.isEmpty() ? "N/A" : worst.get(0)[0]);
        kpi.put("worstScore", worst.isEmpty() ? 0 : worst.get(0)[1]);
        result.put("kpi", kpi);

        // Performance comparison (bar chart)
        List<Object[]> perfData = repo.getDepartmentPerformanceFiltered(deptFilter, startDate, endDate);
        result.put("performance", perfData.stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("department", row[0]);
            m.put("totalValue", row[1]);
            return m;
        }).toList());

        // Contribution (pie chart)
        List<Object[]> contribData = repo.getDepartmentContribution();
        BigDecimal grandTotal = contribData.stream()
                .map(r -> (BigDecimal) r[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        result.put("contribution", contribData.stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("department", row[0]);
            BigDecimal val = (BigDecimal) row[1];
            m.put("value", val);
            m.put("percentage", grandTotal.compareTo(BigDecimal.ZERO) > 0
                    ? val.multiply(BigDecimal.valueOf(100)).divide(grandTotal, 1, java.math.RoundingMode.HALF_UP)
                    : BigDecimal.ZERO);
            return m;
        }).toList());

        // Monthly trends (line chart)
        List<Object[]> trendData = repo.getMonthlyTrendsFiltered(deptFilter, startDate, endDate);
        Map<String, Map<String, Object>> trendMap = new LinkedHashMap<>();
        for (Object[] row : trendData) {
            String month = (String) row[0];
            String dept = (String) row[1];
            trendMap.computeIfAbsent(month, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("month", k);
                return m;
            }).put(dept, row[2]);
        }
        result.put("trends", new ArrayList<>(trendMap.values()));

        // Average metrics by department
        List<Object[]> avgData = repo.getAvgMetricsByDepartment();
        Map<String, Map<String, Object>> avgMap = new LinkedHashMap<>();
        for (Object[] row : avgData) {
            String dept = (String) row[0];
            String metric = (String) row[1];
            avgMap.computeIfAbsent(dept, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("department", k);
                return m;
            }).put(metric, row[2]);
        }
        result.put("avgMetrics", new ArrayList<>(avgMap.values()));

        // Report count by department
        List<Object[]> countData = repo.getReportCountByDepartment();
        result.put("reportCounts", countData.stream().map(row -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("department", row[0]);
            m.put("count", row[1]);
            return m;
        }).toList());

        // All department names
        result.put("departments", departments);

        return result;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Compare departments
    // ════════════════════════════════════════════════════════════════════════
    public Map<String, Object> compareDepartments(List<String> departments) {
        Map<String, Object> result = new LinkedHashMap<>();

        List<Object[]> comparison = repo.compareDepartments(departments);
        Map<String, Map<String, Object>> compareMap = new LinkedHashMap<>();
        for (Object[] row : comparison) {
            String dept = (String) row[0];
            String metric = (String) row[1];
            compareMap.computeIfAbsent(dept, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("department", k);
                return m;
            });
            compareMap.get(dept).put(metric + "_total", row[2]);
            compareMap.get(dept).put(metric + "_avg", row[3]);
        }
        result.put("comparison", new ArrayList<>(compareMap.values()));

        // Monthly trends for compared departments
        List<Object[]> trendData = repo.getMonthlyTrendsForDepartments(departments);
        Map<String, Map<String, Object>> trendMap = new LinkedHashMap<>();
        for (Object[] row : trendData) {
            String month = (String) row[0];
            String dept = (String) row[1];
            trendMap.computeIfAbsent(month, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("month", k);
                return m;
            }).put(dept, row[2]);
        }
        result.put("trends", new ArrayList<>(trendMap.values()));

        return result;
    }

    // ════════════════════════════════════════════════════════════════════════
    // Get paginated list of all uploaded reports
    // ════════════════════════════════════════════════════════════════════════
    public Page<DepartmentReport> getAllReports(Pageable pageable) {
        return repo.findAllByOrderByUploadedAtDesc(pageable);
    }

    // ════════════════════════════════════════════════════════════════════════
    // Get upload history (unique files)
    // ════════════════════════════════════════════════════════════════════════
    public List<Map<String, Object>> getUploadHistory() {
        try {
            List<Object[]> history = repo.getUploadHistorySimple();
            return history.stream().map(row -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("fileName", row[0]);
                m.put("uploadedBy", row[1]);
                m.put("uploadedAt", row[2] != null ? row[2].toString() : "");
                m.put("recordCount", row[3]);
                return m;
            }).toList();
        } catch (Exception e) {
            log.warn("Failed to get upload history: {}", e.getMessage());
            return List.of();
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CSV parser
    // ════════════════════════════════════════════════════════════════════════
    private void parseCsv(MultipartFile file, List<DepartmentReport> valid,
                          List<Map<String, Object>> errors, String by, String fileName) throws Exception {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String header = br.readLine();
            if (header == null) {
                addErr(errors, 1, "file", "Empty file");
                return;
            }
            validateHeader(header.split(",", -1), errors);
            if (!errors.isEmpty()) return;

            String line;
            int row = 2;
            while ((line = br.readLine()) != null) {
                if (line.isBlank()) { row++; continue; }
                String[] c = line.split(",", -1);
                processRow(c, row++, valid, errors, by, fileName);
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // Excel parser
    // ════════════════════════════════════════════════════════════════════════
    private void parseXlsx(MultipartFile file, List<DepartmentReport> valid,
                           List<Map<String, Object>> errors, String by, String fileName) throws Exception {
        try (Workbook wb = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;
            for (Row row : sheet) {
                if (rowNum == 0) {
                    // Validate header
                    String[] headers = new String[4];
                    for (int i = 0; i < 4; i++) headers[i] = cell(row, i);
                    validateHeader(headers, errors);
                    if (!errors.isEmpty()) return;
                    rowNum++;
                    continue;
                }
                if (row == null) { rowNum++; continue; }
                String[] c = new String[]{ cell(row, 0), cell(row, 1), cell(row, 2), cell(row, 3) };
                processRow(c, ++rowNum, valid, errors, by, fileName);
            }
        }
    }

    private String cell(Row row, int idx) {
        Cell c = row.getCell(idx);
        if (c == null) return "";
        return switch (c.getCellType()) {
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(c)) {
                    yield c.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double num = c.getNumericCellValue();
                if (num == Math.floor(num) && !Double.isInfinite(num)) {
                    yield String.valueOf((long) num);
                }
                yield String.valueOf(num);
            }
            case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
            default -> c.getStringCellValue().trim();
        };
    }

    // ════════════════════════════════════════════════════════════════════════
    // Header validation
    // ════════════════════════════════════════════════════════════════════════
    private void validateHeader(String[] headers, List<Map<String, Object>> errors) {
        String[] expected = {"department", "metric_name", "metric_value", "report_date"};
        if (headers.length < 4) {
            addErr(errors, 1, "header", "Expected 4 columns: department, metric_name, metric_value, report_date. Got " + headers.length);
            return;
        }
        for (int i = 0; i < 4; i++) {
            String h = headers[i].trim().toLowerCase().replace(" ", "_");
            if (!h.equals(expected[i])) {
                addErr(errors, 1, "header",
                        "Column " + (i + 1) + " should be '" + expected[i] + "' but got '" + headers[i].trim() + "'");
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // Row validator/builder
    // ════════════════════════════════════════════════════════════════════════
    private void processRow(String[] c, int row, List<DepartmentReport> valid,
                            List<Map<String, Object>> errors, String by, String fileName) {
        if (c.length < 4) { addErr(errors, row, "row", "Not enough columns (need 4)"); return; }
        String dept = c[0].trim(), metric = c[1].trim(), valStr = c[2].trim(), dateStr = c[3].trim();

        if (dept.isEmpty()) { addErr(errors, row, "department", "Empty"); return; }
        if (!VALID_DEPTS.contains(dept)) {
            addErr(errors, row, "department", "Invalid: " + dept + ". Valid: " + String.join(", ", VALID_DEPTS));
            return;
        }
        if (metric.isEmpty()) { addErr(errors, row, "metric_name", "Empty"); return; }

        BigDecimal value;
        try { value = new BigDecimal(valStr); }
        catch (Exception e) { addErr(errors, row, "metric_value", "Not a number: " + valStr); return; }

        LocalDate reportDate = null;
        for (String fmt : new String[]{"yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy"}) {
            try { reportDate = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(fmt)); break; }
            catch (DateTimeParseException ignored) {}
        }
        if (reportDate == null) {
            addErr(errors, row, "report_date", "Invalid date format: " + dateStr + ". Use yyyy-MM-dd");
            return;
        }

        String reportMonth = reportDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));

        valid.add(DepartmentReport.builder()
                .department(dept)
                .metricName(metric)
                .metricValue(value)
                .reportDate(reportDate)
                .reportMonth(reportMonth)
                .uploadedBy(by)
                .fileName(fileName)
                .build());
    }

    private void addErr(List<Map<String, Object>> errors, int row, String field, String issue) {
        errors.add(Map.of("row", row, "field", field, "issue", issue));
    }
}
