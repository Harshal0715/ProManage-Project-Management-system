package com.project.management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.project.management.model.LeaveRequest;
import com.project.management.service.LeaveService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/leaves")
@CrossOrigin
public class LeaveController {

    private final LeaveService service;

    public LeaveController(LeaveService service) {
        this.service = service;
    }

    // =====================================
    // ✅ Apply Leave (Employee)
    // =====================================
    @PostMapping
    public LeaveRequest applyLeave(
            @PathVariable String workspaceId,
            @RequestBody LeaveRequest leave) {

        if (leave.getEmployeeId() == null || leave.getEmployeeId().isBlank()) {
            throw new RuntimeException("Employee ID is required");
        }

        return service.applyLeave(workspaceId, leave);
    }

    // =====================================
    // ✅ Get all leaves (Admin) with employee name + dates
    // =====================================
    @GetMapping
    public List<Map<String, Object>> getAllLeaves(@PathVariable String workspaceId) {
        return service.getLeavesByWorkspace(workspaceId);
    }

    // =====================================
    // ✅ Get employee leaves
    // =====================================
    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getLeavesByEmployee(
            @PathVariable String workspaceId,
            @PathVariable String employeeId) {

        return service.getLeavesByEmployee(workspaceId, employeeId);
    }

    // =====================================
    // ✅ Get by ID (Secure)
    // =====================================
    @GetMapping("/{leaveId}")
    public LeaveRequest getLeaveById(
            @PathVariable String workspaceId,
            @PathVariable String leaveId) {

        return service.getLeaveById(workspaceId, leaveId);
    }

    // =====================================
    // ✅ Update Status (Admin)
    // =====================================
    @PutMapping("/{leaveId}/status")
    public LeaveRequest updateLeaveStatus(
            @PathVariable String workspaceId,
            @PathVariable String leaveId,
            @RequestParam String status) {

        if (!status.equals("Approved") && !status.equals("Rejected")) {
            throw new RuntimeException("Invalid leave status. Use Approved or Rejected.");
        }

        return service.updateLeaveStatus(workspaceId, leaveId, status);
    }
}
