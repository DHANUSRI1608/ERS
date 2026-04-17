package com.enterprise.reporting.controller;

import com.enterprise.reporting.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AnalyticsController {

    private final DataService dataService;

    @GetMapping("/weekly-metrics")
    public List<DataService.DepartmentMetric> getWeeklyMetrics() {
        return dataService.getWeeklyMetrics();
    }

    @GetMapping("/summary")
    public DataService.AnalyticsSummary getSummary() {
        return dataService.getSummary();
    }

    @GetMapping("/revenue")
    public List<DataService.RevenueTrend> getRevenueTrend() {
        return dataService.getRevenueTrend();
    }
}
