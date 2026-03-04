package com.project.management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.management.model.Notification;
import com.project.management.service.NotificationService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // =====================================
    // ✅ Get all notifications for employee
    // =====================================
    @GetMapping("/employee/{employeeId}")
    public List<Notification> getEmployeeNotifications(
            @PathVariable String workspaceId,
            @PathVariable String employeeId) {

        return service.getNotifications(workspaceId, employeeId);
    }

    // =====================================
    // ✅ Get unread count
    // =====================================
    @GetMapping("/employee/{employeeId}/unread-count")
    public long getUnreadCount(
            @PathVariable String workspaceId,
            @PathVariable String employeeId) {

        return service.getUnreadCount(workspaceId, employeeId);
    }

    // =====================================
    // ✅ Get single notification
    // =====================================
    @GetMapping("/{notificationId}")
    public Notification getById(
            @PathVariable String workspaceId,
            @PathVariable String notificationId) {

        return service.getById(workspaceId, notificationId);
    }

    // =====================================
    // ✅ Mark one as read
    // =====================================
    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(
            @PathVariable String workspaceId,
            @PathVariable String notificationId) {

        return service.markAsRead(workspaceId, notificationId);
    }

    // =====================================
    // ✅ Mark all as read
    // =====================================
    @PutMapping("/employee/{employeeId}/read-all")
    public void markAllAsRead(
            @PathVariable String workspaceId,
            @PathVariable String employeeId) {

        service.markAllAsRead(workspaceId, employeeId);
    }
}