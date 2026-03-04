package com.project.management.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    private String title;
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    // Status: Planning | Active | OnHold | Completed
    private String status;

    // Priority: Low | Medium | High
    private String priority;

    // 🔥 Workspace isolation (VERY IMPORTANT)
    @Indexed
    private String workspaceId;

    // Project Lead (employee ID)
    private String projectLeadId;

    // Assigned employees
    private List<String> assignedEmployeeIds = new ArrayList<>();

    // Project progress (0–100)
    private int progressPercent;

    // 🔥 AI Prediction (Future ready)
    private Double predictedDelayRisk; // 0.0 – 1.0

    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Project() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // ===== ID =====
    public String getId() {
        return id;
    }

    // ===== Title =====
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Description =====
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Dates =====
    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    // ===== Status =====
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Priority =====
    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Workspace =====
    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    // ===== Project Lead =====
    public String getProjectLeadId() {
        return projectLeadId;
    }

    public void setProjectLeadId(String projectLeadId) {
        this.projectLeadId = projectLeadId;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Employees =====
    public List<String> getAssignedEmployeeIds() {
        return assignedEmployeeIds;
    }

    public void setAssignedEmployeeIds(List<String> assignedEmployeeIds) {
        this.assignedEmployeeIds = assignedEmployeeIds;
    }

    // ===== Progress =====
    public int getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(int progressPercent) {
        this.progressPercent = progressPercent;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== AI Risk =====
    public Double getPredictedDelayRisk() {
        return predictedDelayRisk;
    }

    public void setPredictedDelayRisk(Double predictedDelayRisk) {
        this.predictedDelayRisk = predictedDelayRisk;
    }

    // ===== Audit =====
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
