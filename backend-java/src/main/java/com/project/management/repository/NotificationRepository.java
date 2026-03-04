package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.Notification;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    // =========================
    // 🔥 WORKSPACE ISOLATION
    // =========================

    List<Notification> findByWorkspaceIdAndEmployeeIdOrderByCreatedAtDesc(
            String workspaceId,
            String employeeId
    );

    List<Notification> findByWorkspaceIdAndEmployeeId(
            String workspaceId,
            String employeeId
    );

    Optional<Notification> findByWorkspaceIdAndId(
            String workspaceId,
            String id
    );

    // =========================
    // BADGE / ANALYTICS (Scoped)
    // =========================

    long countByWorkspaceIdAndEmployeeIdAndReadFalse(
            String workspaceId,
            String employeeId
    );

    long countByWorkspaceIdAndEmployeeId(
            String workspaceId,
            String employeeId
    );
}