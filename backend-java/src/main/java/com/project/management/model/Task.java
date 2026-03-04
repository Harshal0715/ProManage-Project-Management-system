package com.project.management.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;
    private String description;

    // 🔥 Important indexes for fast filtering
    @Indexed
    private String workspaceId;

    @Indexed
    private String projectId;

    @Indexed
    private String employeeId;

    // Pending | InProgress | Done
    private String status = "Pending";

    // Low | Medium | High
    private String priority = "Low";

    private LocalDate dueDate;

    // =========================
    // Employee Work Update
    // =========================
    private String progressNote;
    private String proofLink;

    // =========================
    // AI / Analytics Fields
    // =========================
    private int estimatedHours = 0;
    private int actualHours = 0;
    private int progressPercent = 0;

    // 🔥 Future AI Prediction
    private Double delayRiskScore; // 0.0 - 1.0

    // =========================
    // Audit
    // =========================
    private LocalDateTime createdAt = LocalDateTime.now();

    @LastModifiedDate
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Task() {}

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

    // ===== Workspace =====
    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    // ===== Project =====
    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    // ===== Employee =====
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
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
    }

    // ===== Due Date =====
    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    // ===== Progress Note =====
    public String getProgressNote() {
        return progressNote;
    }

    public void setProgressNote(String progressNote) {
        this.progressNote = progressNote;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Proof Link =====
    public String getProofLink() {
        return proofLink;
    }

    public void setProofLink(String proofLink) {
        this.proofLink = proofLink;
        this.updatedAt = LocalDateTime.now();
    }

    // ===== Estimated Hours =====
    public int getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(int estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    // ===== Actual Hours =====
    public int getActualHours() {
        return actualHours;
    }

    public void setActualHours(int actualHours) {
        this.actualHours = actualHours;
    }

    // ===== Progress Percent =====
    public int getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(int progressPercent) {
        this.progressPercent = progressPercent;
    }

    // ===== AI Risk =====
    public Double getDelayRiskScore() {
        return delayRiskScore;
    }

    public void setDelayRiskScore(Double delayRiskScore) {
        this.delayRiskScore = delayRiskScore;
    }

    // ===== Audit =====
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}