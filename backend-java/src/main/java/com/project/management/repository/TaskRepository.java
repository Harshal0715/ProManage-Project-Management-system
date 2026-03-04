package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.Task;

public interface TaskRepository extends MongoRepository<Task, String> {

    // =========================
    // 🔥 WORKSPACE ISOLATION
    // =========================

    // ✅ All tasks in a workspace
    List<Task> findByWorkspaceId(String workspaceId);

    // ✅ Single task lookup by workspace + id
    Optional<Task> findByWorkspaceIdAndId(String workspaceId, String id);

    // ✅ Tasks by project (all statuses)
    List<Task> findByWorkspaceIdAndProjectId(String workspaceId, String projectId);

    // ✅ All tasks for an employee (no status filter)
    List<Task> findByWorkspaceIdAndEmployeeId(String workspaceId, String employeeId);

    // ✅ Tasks by workspace + status (for admin dashboards)
    List<Task> findByWorkspaceIdAndStatus(String workspaceId, String status);

    // ✅ Tasks by employee + status (explicit filter, optional use)
    List<Task> findByWorkspaceIdAndEmployeeIdAndStatus(String workspaceId, String employeeId, String status);

    // =========================
    // EMPLOYEE ANALYTICS (Scoped)
    // =========================

    long countByWorkspaceIdAndEmployeeId(String workspaceId, String employeeId);

    long countByWorkspaceIdAndEmployeeIdAndStatus(
            String workspaceId,
            String employeeId,
            String status
    );

    // =========================
    // ADMIN ANALYTICS (Scoped)
    // =========================

    long countByWorkspaceIdAndStatus(String workspaceId, String status);

    // =========================
    // PROJECT ANALYTICS (Scoped)
    // =========================

    long countByWorkspaceIdAndProjectIdAndStatus(
            String workspaceId,
            String projectId,
            String status
    );
}
