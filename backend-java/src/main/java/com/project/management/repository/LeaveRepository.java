package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.LeaveRequest;

public interface LeaveRepository extends MongoRepository<LeaveRequest, String> {

    // =========================
    // 🔥 WORKSPACE ISOLATION
    // =========================

    List<LeaveRequest> findByWorkspaceId(String workspaceId);

    Optional<LeaveRequest> findByWorkspaceIdAndId(String workspaceId, String id);

    List<LeaveRequest> findByWorkspaceIdAndEmployeeId(String workspaceId, String employeeId);

    List<LeaveRequest> findByWorkspaceIdAndStatus(String workspaceId, String status);

    List<LeaveRequest> findByWorkspaceIdOrderByFromDateDesc(String workspaceId);

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
}