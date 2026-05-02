package com.ers.repository;

import com.ers.entity.DepartmentReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DepartmentReportRepository extends JpaRepository<DepartmentReport, Long> {

    // ── Performance summary: total metric value per department ──────────────
    @Query("SELECT d.department, SUM(d.metricValue) FROM DepartmentReport d GROUP BY d.department ORDER BY SUM(d.metricValue) DESC")
    List<Object[]> getDepartmentPerformanceSummary();

    // ── Filtered performance summary ────────────────────────────────────────
    @Query("SELECT d.department, SUM(d.metricValue) FROM DepartmentReport d " +
           "WHERE (:dept IS NULL OR d.department = :dept) " +
           "AND (:startDate IS NULL OR d.reportDate >= :startDate) " +
           "AND (:endDate IS NULL OR d.reportDate <= :endDate) " +
           "GROUP BY d.department ORDER BY SUM(d.metricValue) DESC")
    List<Object[]> getDepartmentPerformanceFiltered(
        @Param("dept") String dept,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    // ── Contribution percentage (raw totals — calc % in service) ────────────
    @Query("SELECT d.department, SUM(d.metricValue) FROM DepartmentReport d GROUP BY d.department")
    List<Object[]> getDepartmentContribution();

    // ── Monthly trends per department ───────────────────────────────────────
    @Query("SELECT d.reportMonth, d.department, SUM(d.metricValue) FROM DepartmentReport d " +
           "GROUP BY d.reportMonth, d.department ORDER BY d.reportMonth, d.department")
    List<Object[]> getMonthlyTrends();

    // ── Filtered monthly trends ─────────────────────────────────────────────
    @Query("SELECT d.reportMonth, d.department, SUM(d.metricValue) FROM DepartmentReport d " +
           "WHERE (:dept IS NULL OR d.department = :dept) " +
           "AND (:startDate IS NULL OR d.reportDate >= :startDate) " +
           "AND (:endDate IS NULL OR d.reportDate <= :endDate) " +
           "GROUP BY d.reportMonth, d.department ORDER BY d.reportMonth, d.department")
    List<Object[]> getMonthlyTrendsFiltered(
        @Param("dept") String dept,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);

    // ── Average metrics by department ───────────────────────────────────────
    @Query("SELECT d.department, d.metricName, AVG(d.metricValue) FROM DepartmentReport d " +
           "GROUP BY d.department, d.metricName ORDER BY d.department, d.metricName")
    List<Object[]> getAvgMetricsByDepartment();

    // ── Report count per department ─────────────────────────────────────────
    @Query("SELECT d.department, COUNT(d) FROM DepartmentReport d GROUP BY d.department ORDER BY COUNT(d) DESC")
    List<Object[]> getReportCountByDepartment();

    // ── Total distinct departments ──────────────────────────────────────────
    @Query("SELECT DISTINCT d.department FROM DepartmentReport d ORDER BY d.department")
    List<String> findDistinctDepartments();

    // ── Best performing (highest total metric value) ────────────────────────
    @Query("SELECT d.department, SUM(d.metricValue) FROM DepartmentReport d GROUP BY d.department ORDER BY SUM(d.metricValue) DESC")
    List<Object[]> getBestPerforming();

    // ── Worst performing (lowest total metric value) ────────────────────────
    @Query("SELECT d.department, SUM(d.metricValue) FROM DepartmentReport d GROUP BY d.department ORDER BY SUM(d.metricValue) ASC")
    List<Object[]> getWorstPerforming();

    // ── Filter by department ────────────────────────────────────────────────
    List<DepartmentReport> findByDepartment(String department);

    // ── Filter by date range ────────────────────────────────────────────────
    List<DepartmentReport> findByReportDateBetween(LocalDate start, LocalDate end);

    // ── Paginated list with ordering ────────────────────────────────────────
    Page<DepartmentReport> findAllByOrderByUploadedAtDesc(Pageable pageable);

    // ── Compare specific departments ────────────────────────────────────────
    @Query("SELECT d.department, d.metricName, SUM(d.metricValue), AVG(d.metricValue) " +
           "FROM DepartmentReport d WHERE d.department IN :departments " +
           "GROUP BY d.department, d.metricName ORDER BY d.department, d.metricName")
    List<Object[]> compareDepartments(@Param("departments") List<String> departments);

    // ── Monthly trends for specific departments ─────────────────────────────
    @Query("SELECT d.reportMonth, d.department, SUM(d.metricValue) FROM DepartmentReport d " +
           "WHERE d.department IN :departments " +
           "GROUP BY d.reportMonth, d.department ORDER BY d.reportMonth, d.department")
    List<Object[]> getMonthlyTrendsForDepartments(@Param("departments") List<String> departments);

    // ── Count of unique file uploads ────────────────────────────────────────
    @Query("SELECT COUNT(DISTINCT d.fileName) FROM DepartmentReport d")
    Long countDistinctUploads();

    // ── Upload history (distinct files) ─────────────────────────────────────
    @Query("SELECT d.fileName, d.uploadedBy, MAX(d.uploadedAt), COUNT(d), " +
           "GROUP_CONCAT(DISTINCT d.department) " +
           "FROM DepartmentReport d GROUP BY d.fileName, d.uploadedBy ORDER BY MAX(d.uploadedAt) DESC")
    List<Object[]> getUploadHistory();

    // H2-compatible upload history (no GROUP_CONCAT)
    @Query("SELECT d.fileName, d.uploadedBy, MAX(d.uploadedAt), COUNT(d) " +
           "FROM DepartmentReport d GROUP BY d.fileName, d.uploadedBy ORDER BY MAX(d.uploadedAt) DESC")
    List<Object[]> getUploadHistorySimple();
}
