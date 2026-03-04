package com.project.management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.management.model.Project;
import com.project.management.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    // =====================================
    // ✅ CREATE PROJECT
    // =====================================
    public Project addProject(String workspaceId, Project project) {
        project.setWorkspaceId(workspaceId);
        return repository.save(project);
    }

    // =====================================
    // ✅ GET ALL PROJECTS (Workspace Scoped)
    // =====================================
    public List<Project> getProjectsByWorkspace(String workspaceId) {
        return repository.findByWorkspaceId(workspaceId);
    }

    // =====================================
    // ✅ GET PROJECT BY ID (Secure)
    // =====================================
    public Project getProjectById(String workspaceId, String projectId) {
        return repository.findByWorkspaceIdAndId(workspaceId, projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    // =====================================
    // ✅ UPDATE PROJECT (Secure)
    // =====================================
    public Project updateProject(String workspaceId,
                                 String projectId,
                                 Project updated) {

        Project project = getProjectById(workspaceId, projectId);

        project.setTitle(updated.getTitle());
        project.setDescription(updated.getDescription());
        project.setStartDate(updated.getStartDate());
        project.setEndDate(updated.getEndDate());
        project.setStatus(updated.getStatus());
        project.setPriority(updated.getPriority());
        project.setProjectLeadId(updated.getProjectLeadId());
        project.setAssignedEmployeeIds(updated.getAssignedEmployeeIds());
        project.setProgressPercent(updated.getProgressPercent());
        project.setPredictedDelayRisk(updated.getPredictedDelayRisk());

        return repository.save(project);
    }

    // =====================================
    // ✅ DELETE PROJECT
    // =====================================
    public void deleteProject(String workspaceId, String projectId) {
        Project project = getProjectById(workspaceId, projectId);
        repository.delete(project);
    }

    // =====================================
    // ✅ FILTERS
    // =====================================
    public List<Project> getProjectsByStatus(String workspaceId, String status) {
        return repository.findByWorkspaceIdAndStatus(workspaceId, status);
    }

    public List<Project> getProjectsByPriority(String workspaceId, String priority) {
        return repository.findByWorkspaceIdAndPriority(workspaceId, priority);
    }

    public List<Project> getProjectsByLead(String workspaceId, String leadId) {
        return repository.findByWorkspaceIdAndProjectLeadId(workspaceId, leadId);
    }

    public List<Project> getProjectsByStatusAndPriority(String workspaceId, String status, String priority) {
        return repository.findByWorkspaceIdAndStatusAndPriority(workspaceId, status, priority);
    }

    public List<Project> searchProjects(String workspaceId, String keyword) {
        return repository.findByWorkspaceIdAndTitleContainingIgnoreCase(workspaceId, keyword);
    }
}
