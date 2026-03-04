package com.project.management.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.management.dto.AdminAnalyticsResponse;
import com.project.management.dto.EmployeeAnalyticsResponse;
import com.project.management.service.AnalyticsService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/analytics")
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    // =====================================
    // ✅ Employee Analytics (Workspace Scoped)
    // =====================================
    @GetMapping("/employee/{employeeId}")
    public EmployeeAnalyticsResponse getEmployeeAnalytics(
            @PathVariable String workspaceId,
            @PathVariable String employeeId) {

        return service.getEmployeeAnalytics(workspaceId, employeeId);
    }

    // =====================================
    // ✅ Admin Analytics (Workspace Scoped)
    // =====================================
    @GetMapping("/admin")
    public AdminAnalyticsResponse getAdminAnalytics(
            @PathVariable String workspaceId) {

        return service.getAdminAnalytics(workspaceId);
    }
}