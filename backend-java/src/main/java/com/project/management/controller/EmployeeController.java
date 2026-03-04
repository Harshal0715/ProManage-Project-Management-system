package com.project.management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.management.model.Employee;
import com.project.management.service.EmployeeService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/employees")
@CrossOrigin
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // Add Employee
    @PostMapping
    public Employee addEmployee(@PathVariable String workspaceId,
                                @RequestBody Employee employee) {
        return service.addEmployee(workspaceId, employee);
    }

    // Get All Employees (Workspace Scoped)
    @GetMapping
    public List<Employee> getEmployees(@PathVariable String workspaceId) {
        return service.getEmployeesByWorkspace(workspaceId);
    }

    // Get Employee By ID
    @GetMapping("/{employeeId}")
    public Employee getById(@PathVariable String workspaceId,
                            @PathVariable String employeeId) {
        return service.getEmployeeById(workspaceId, employeeId);
    }

    // Delete Employee
    @DeleteMapping("/{employeeId}")
    public void delete(@PathVariable String workspaceId,
                       @PathVariable String employeeId) {
        service.deleteEmployee(workspaceId, employeeId);
    }

    // Team Member List (Employee Side)
    @GetMapping("/members")
    public List<Employee> getTeamMembers(@PathVariable String workspaceId) {
        return service.getEmployeesByWorkspace(workspaceId);
    }
}
