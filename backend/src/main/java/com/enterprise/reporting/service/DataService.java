package com.enterprise.reporting.service;

import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class DataService {

    @Data
    @Builder
    public static class DepartmentMetric {
        private String department;
        private double revenue;
        private double growth;
        private int performance;
    }

    @Data
    @Builder
    public static class AnalyticsSummary {
        private double totalRevenue;
        private int reportsGenerated;
        private int activeUsers;
        private double weeklyGrowth;
    }

    @Data
    @Builder
    public static class RevenueTrend {
        private String date;
        private double revenue;
    }

    public List<DepartmentMetric> getWeeklyMetrics() {
        List<DepartmentMetric> metrics = new ArrayList<>();
        String[] departments = {"Finance", "Sales", "Operations", "HR", "Marketing"};
        Random random = new Random();

        for (String dept : departments) {
            metrics.add(DepartmentMetric.builder()
                .department(dept)
                .revenue(10000 + random.nextDouble() * 50000)
                .growth(-5 + random.nextDouble() * 20)
                .performance(60 + random.nextInt(40))
                .build());
        }
        return metrics;
    }

    public AnalyticsSummary getSummary() {
        return AnalyticsSummary.builder()
            .totalRevenue(245000.0)
            .reportsGenerated(128)
            .activeUsers(45)
            .weeklyGrowth(12.5)
            .build();
    }

    public List<RevenueTrend> getRevenueTrend() {
        List<RevenueTrend> trends = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        double startRevenue = 15000;
        Random random = new Random();

        for (String day : days) {
            startRevenue += (random.nextDouble() * 5000) - 1000;
            trends.add(RevenueTrend.builder()
                .date(day)
                .revenue(startRevenue)
                .build());
        }
        return trends;
    }
}
