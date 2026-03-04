package com.project.management.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    // 🔥 Workspace isolation
    @Indexed
    private String workspaceId;

    // 🔥 Employee isolation
    @Indexed
    private String employeeId;

    private String message;

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

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

    // ===== Message =====
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // ===== Read =====
    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    // ===== Created At =====
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}