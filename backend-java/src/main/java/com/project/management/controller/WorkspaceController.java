package com.project.management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.management.model.Employee;
import com.project.management.model.Workspace;
import com.project.management.repository.EmployeeRepository;
import com.project.management.service.WorkspaceService;

@RestController
@RequestMapping("/api/workspaces")
@CrossOrigin
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final EmployeeRepository employeeRepository;

    public WorkspaceController(WorkspaceService workspaceService, EmployeeRepository employeeRepository) {
        this.workspaceService = workspaceService;
        this.employeeRepository = employeeRepository;
    }

    // =====================================
    // ✅ CREATE WORKSPACE (Owner Scoped)
    // =====================================
    @PostMapping("/owner/{ownerId}")
    public Workspace createWorkspace(@PathVariable String ownerId,
                                     @RequestBody Workspace workspace) {
        return workspaceService.createWorkspace(workspace, ownerId);
    }

    // =====================================
    // ✅ GET ALL WORKSPACES FOR OWNER
    // =====================================
    @GetMapping("/owner/{ownerId}")
    public List<Workspace> getWorkspacesByOwner(@PathVariable String ownerId) {
        return workspaceService.getWorkspacesByOwner(ownerId);
    }

    // =====================================
    // ✅ GET ONE WORKSPACE (Secure)
    // =====================================
    @GetMapping("/owner/{ownerId}/{workspaceId}")
    public Workspace getWorkspace(@PathVariable String ownerId,
                                  @PathVariable String workspaceId) {
        return workspaceService.getWorkspaceById(workspaceId, ownerId);
    }

    // =====================================
    // ✅ DELETE WORKSPACE (Secure)
    // =====================================
    @DeleteMapping("/owner/{ownerId}/{workspaceId}")
    public void deleteWorkspace(@PathVariable String ownerId,
                                @PathVariable String workspaceId) {
        workspaceService.deleteWorkspace(workspaceId, ownerId);
    }

    // =====================================
    // ✅ GET TEAM MEMBERS FOR A WORKSPACE
    // =====================================
    @GetMapping("/{workspaceId}/members")
    public List<Employee> getWorkspaceMembers(@PathVariable String workspaceId) {
        return employeeRepository.findByWorkspaceId(workspaceId);
    }

    // =====================================
    // ✅ GET ALL WORKSPACES FOR AN EMPLOYEE
    // =====================================
    @GetMapping("/employee/{employeeId}")
    public List<Workspace> getEmployeeWorkspaces(@PathVariable String employeeId) {
        return workspaceService.getWorkspacesByEmployee(employeeId);
    }
}
