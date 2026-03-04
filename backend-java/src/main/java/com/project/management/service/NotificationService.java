package com.project.management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.management.model.Notification;
import com.project.management.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    // =====================================
    // ✅ CREATE (Workspace Required)
    // =====================================
    public Notification createNotification(String workspaceId,
                                           String employeeId,
                                           String message) {

        Notification n = new Notification();
        n.setWorkspaceId(workspaceId);
        n.setEmployeeId(employeeId);
        n.setMessage(message);

        return repo.save(n);
    }

    // =====================================
    // ✅ GET ALL (Workspace Scoped)
    // =====================================
    public List<Notification> getNotifications(String workspaceId,
                                               String employeeId) {

        return repo.findByWorkspaceIdAndEmployeeIdOrderByCreatedAtDesc(
                workspaceId,
                employeeId
        );
    }

    // =====================================
    // ✅ UNREAD COUNT (Scoped)
    // =====================================
    public long getUnreadCount(String workspaceId,
                               String employeeId) {

        return repo.countByWorkspaceIdAndEmployeeIdAndReadFalse(
                workspaceId,
                employeeId
        );
    }

    // =====================================
    // ✅ GET BY ID (Secure)
    // =====================================
    public Notification getById(String workspaceId, String id) {

        return repo.findByWorkspaceIdAndId(workspaceId, id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    // =====================================
    // ✅ MARK ONE READ
    // =====================================
    public Notification markAsRead(String workspaceId,
                                   String notificationId) {

        Notification n = getById(workspaceId, notificationId);
        n.setRead(true);
        return repo.save(n);
    }

    // =====================================
    // ✅ MARK ALL READ
    // =====================================
    public void markAllAsRead(String workspaceId,
                              String employeeId) {

        List<Notification> list =
                repo.findByWorkspaceIdAndEmployeeId(workspaceId, employeeId);

        for (Notification n : list) {
            if (!n.isRead()) {
                n.setRead(true);
                repo.save(n);
            }
        }
    }
}