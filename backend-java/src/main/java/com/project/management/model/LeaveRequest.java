package com.project.management.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leave_requests")
public class LeaveRequest {

    @Id
    private String id;

    // 🔥 Workspace isolation (VERY IMPORTANT)
    @Indexed
    private String workspaceId;

    @Indexed
    private String employeeId;

    private String reason;

    private LocalDate fromDate;
    private LocalDate toDate;

    // Pending | Approved | Rejected
    private String status = "Pending";

    // Derived + analytics ready
    private int totalDays;

    // Audit fields
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;
    private String reviewedBy;

    public LeaveRequest() {}

    // ===== ID =====
    public String getId() {
        return id;
    }

    // ===== Workspace =====
    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    // ===== Employee =====
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    // ===== Reason =====
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    // ===== From Date =====
    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
        computeDays();
    }

    // ===== To Date =====
    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
        computeDays();
    }

    // ===== Status =====
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.reviewedAt = LocalDateTime.now();
    }

    // ===== Total Days =====
    public int getTotalDays() {
        return totalDays;
    }

    // ===== Created At =====
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ===== Reviewed At =====
    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    // ===== Reviewed By =====
    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    // Auto compute days
    private void computeDays() {
        if (fromDate != null && toDate != null) {
            this.totalDays = (int) ChronoUnit.DAYS.between(fromDate, toDate) + 1;
        }
    }
}