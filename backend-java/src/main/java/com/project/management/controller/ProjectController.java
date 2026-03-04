package com.project.management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.management.model.Project;
import com.project.management.service.ProjectService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    // =====================================
    // ✅ CREATE PROJECT
    // =====================================
    @PostMapping
    public Project addProject(@PathVariable String workspaceId,
                              @RequestBody Project project) {
        return service.addProject(workspaceId, project);
    }

    // =====================================
    // ✅ GET ALL PROJECTS (Workspace Scoped)
    // =====================================
    @GetMapping
    public List<Project> getProjects(@PathVariable String workspaceId) {
        return service.getProjectsByWorkspace(workspaceId);
    }

    // =====================================
    // ✅ GET BY ID (Secure)
    // =====================================
    @GetMapping("/{projectId}")
    public Project getProjectById(@PathVariable String workspaceId,
                                  @PathVariable String projectId) {
        return service.getProjectById(workspaceId, projectId);
    }

    // =====================================
    // ✅ UPDATE PROJECT (Secure)
    // =====================================
    @PutMapping("/{projectId}")
    public Project updateProject(@PathVariable String workspaceId,
                                 @PathVariable String projectId,
                                 @RequestBody Project project) {
        return service.updateProject(workspaceId, projectId, project);
    }

    // =====================================
    // ✅ DELETE PROJECT (Secure)
    // =====================================
    @DeleteMapping("/{projectId}")
    public void deleteProject(@PathVariable String workspaceId,
                              @PathVariable String projectId) {
        service.deleteProject(workspaceId, projectId);
    }

    // =====================================
    // ✅ FILTER BY STATUS
    // =====================================
    @GetMapping("/status/{status}")
    public List<Project> getByStatus(@PathVariable String workspaceId,
                                     @PathVariable String status) {
        return service.getProjectsByStatus(workspaceId, status);
    }

    // =====================================
    // ✅ FILTER BY PRIORITY
    // =====================================
    @GetMapping("/priority/{priority}")
    public List<Project> getByPriority(@PathVariable String workspaceId,
                                       @PathVariable String priority) {
        return service.getProjectsByPriority(workspaceId, priority);
    }

    // =====================================
    // ✅ FILTER BY PROJECT LEAD
    // =====================================
    @GetMapping("/lead/{leadId}")
    public List<Project> getByLead(@PathVariable String workspaceId,
                                   @PathVariable String leadId) {
        return service.getProjectsByLead(workspaceId, leadId);
    }

    // =====================================
    // ✅ COMBINED FILTER (Status + Priority)
    // =====================================
    @GetMapping("/filter")
    public List<Project> filterProjects(@PathVariable String workspaceId,
                                        @RequestParam String status,
                                        @RequestParam String priority) {
        return service.getProjectsByStatusAndPriority(workspaceId, status, priority);
    }

    // =====================================
    // ✅ SEARCH BY TITLE
    // =====================================
    @GetMapping("/search")
    public List<Project> search(@PathVariable String workspaceId,
                                @RequestParam String keyword) {
        return service.searchProjects(workspaceId, keyword);
    }
}
