package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.Project;

public interface ProjectRepository extends MongoRepository<Project, String> {

    // 🔥 Workspace isolation (MOST IMPORTANT)
    List<Project> findByWorkspaceId(String workspaceId);

    Optional<Project> findByWorkspaceIdAndId(String workspaceId, String id);

    // Filters inside workspace
    List<Project> findByWorkspaceIdAndStatus(String workspaceId, String status);

    List<Project> findByWorkspaceIdAndTitleContainingIgnoreCase(String workspaceId, String title);

    List<Project> findByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);

    // ===== New Queries =====

    // Filter by priority inside workspace
    List<Project> findByWorkspaceIdAndPriority(String workspaceId, String priority);

    // Filter by project lead inside workspace
    List<Project> findByWorkspaceIdAndProjectLeadId(String workspaceId, String projectLeadId);

    // Combined filter: workspace + status + priority
    List<Project> findByWorkspaceIdAndStatusAndPriority(String workspaceId, String status, String priority);
}
