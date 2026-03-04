package com.project.management.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "discussions")
public class Discussion {
    @Id
    private String id;
    private String workspaceId;
    private String senderId;
    private String senderRole; // ADMIN or EMPLOYEE
    private String senderName; // ✅ NEW field for actual name
    private String message;
    private LocalDateTime timestamp;

    @org.springframework.data.annotation.PersistenceCreator
    public Discussion() {
    }

    public Discussion(String workspaceId, String senderId, String senderRole, String senderName, String message) {
        this.workspaceId = workspaceId;
        this.senderId = senderId;
        this.senderRole = senderRole;
        this.senderName = senderName;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
