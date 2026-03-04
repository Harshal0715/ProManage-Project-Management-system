package com.project.management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.management.model.Workspace;
import com.project.management.repository.WorkspaceRepository;  // ✅ Correct import

@Service
public class WorkspaceService {

    private final WorkspaceRepository repo;

    public WorkspaceService(WorkspaceRepository repo) {
        this.repo = repo;
    }

    // =====================================
    // ✅ CREATE WORKSPACE
    // =====================================
    public Workspace createWorkspace(Workspace workspace, String ownerId) {
        if (ownerId == null || ownerId.isBlank()) {
            throw new RuntimeException("Owner ID is required");
        }
        if (workspace.getName() == null || workspace.getName().isBlank()) {
            throw new RuntimeException("Workspace name is required");
        }

        boolean exists = repo.findByOwnerId(ownerId)
                .stream()
                .anyMatch(w -> w.getName().equalsIgnoreCase(workspace.getName()));

        if (exists) {
            throw new RuntimeException("Workspace with this name already exists");
        }

        workspace.setOwnerId(ownerId);
        workspace.setActive(true);

        return repo.save(workspace);
    }

    // =====================================
    // ✅ GET ALL OWNER WORKSPACES
    // =====================================
    public List<Workspace> getWorkspacesByOwner(String ownerId) {
        if (ownerId == null || ownerId.isBlank()) {
            throw new RuntimeException("Owner ID is required");
        }
        return repo.findByOwnerId(ownerId);
    }

    // =====================================
    // ✅ GET WORKSPACE BY ID (Secure)
    // =====================================
    public Workspace getWorkspaceById(String workspaceId, String ownerId) {
        return repo.findByIdAndOwnerId(workspaceId, ownerId)
                .orElseThrow(() ->
                        new RuntimeException("Workspace not found or access denied"));
    }

    // =====================================
    // ✅ DELETE WORKSPACE (Secure)
    // =====================================
    public void deleteWorkspace(String workspaceId, String ownerId) {
        Workspace workspace = getWorkspaceById(workspaceId, ownerId);
        repo.delete(workspace);
    }

    // =====================================
    // ✅ GET ALL WORKSPACES FOR AN EMPLOYEE
    // =====================================
    public List<Workspace> getWorkspacesByEmployee(String employeeId) {
        if (employeeId == null || employeeId.isBlank()) {
            throw new RuntimeException("Employee ID is required");
        }
        return repo.findByEmployeeIdsContains(employeeId);
    }
}
