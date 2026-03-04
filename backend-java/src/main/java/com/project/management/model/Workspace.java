package com.project.management.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "workspaces")
public class Workspace {

    @Id
    private String id;

    private String name;
    private String description;

    // 🔥 IMPORTANT: Who created this workspace
    private String ownerId;

    // ✅ NEW FIELD: Employees belonging to this workspace
    private List<String> employeeIds;

    // Active / Archived workspace
    private boolean active;

    // Creation timestamp
    private LocalDateTime createdAt;

    // Constructor
    @org.springframework.data.annotation.PersistenceCreator
    public Workspace() {
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    public Workspace(String name, String description, String ownerId) {
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    // ===== ID =====
    public String getId() {
        return id;
    }

    // ===== Name =====
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ===== Description =====
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // ===== Owner =====
    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    // ===== Employees =====
    public List<String> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(List<String> employeeIds) {
        this.employeeIds = employeeIds;
    }

    // ===== Active =====
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    // ===== Created At =====
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
