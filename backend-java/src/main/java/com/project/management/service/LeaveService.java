package com.project.management.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.management.model.LeaveRequest;
import com.project.management.repository.LeaveRepository;
import com.project.management.repository.EmployeeRepository;

@Service
public class LeaveService {

    private final LeaveRepository repo;
    private final EmployeeRepository employeeRepo;

    public LeaveService(LeaveRepository repo, EmployeeRepository employeeRepo) {
        this.repo = repo;
        this.employeeRepo = employeeRepo;
    }

    // =====================================
    // ✅ APPLY LEAVE (Workspace Required)
    // =====================================
    public LeaveRequest applyLeave(String workspaceId, LeaveRequest leave) {
        if (leave.getStatus() == null || leave.getStatus().isBlank()) {
            leave.setStatus("Pending");
        }
        leave.setWorkspaceId(workspaceId);
        return repo.save(leave);
    }

    // =====================================
    // ✅ GET ALL (Workspace Scoped) with employee name + dates
    // =====================================
    public List<Map<String, Object>> getLeavesByWorkspace(String workspaceId) {
    List<LeaveRequest> leaves = repo.findByWorkspaceId(workspaceId);

    return leaves.stream().map(leave -> {
        Map<String, Object> res = new HashMap<>();
        res.put("id", leave.getId());
        res.put("employeeId", leave.getEmployeeId());
        res.put("status", leave.getStatus());
        res.put("workspaceId", leave.getWorkspaceId());

        // ✅ Include reason and dates (convert LocalDate to String)
        res.put("reason", leave.getReason());
        res.put("fromDate", leave.getFromDate() != null ? leave.getFromDate().toString() : null);
        res.put("toDate", leave.getToDate() != null ? leave.getToDate().toString() : null);
        res.put("totalDays", leave.getTotalDays());

        // ✅ Lookup employee name
        employeeRepo.findByWorkspaceIdAndId(workspaceId, leave.getEmployeeId())
                    .ifPresent(emp -> res.put("employeeName", emp.getName()));

        return res;
    }).collect(Collectors.toList());
}

    // =====================================
    // ✅ GET BY EMPLOYEE (Scoped)
    // =====================================
    public List<LeaveRequest> getLeavesByEmployee(String workspaceId, String employeeId) {
        return repo.findByWorkspaceIdAndEmployeeId(workspaceId, employeeId);
    }

    // =====================================
    // ✅ GET BY ID (Secure)
    // =====================================
    public LeaveRequest getLeaveById(String workspaceId, String leaveId) {
        return repo.findByWorkspaceIdAndId(workspaceId, leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));
    }

    // =====================================
    // ✅ UPDATE STATUS (Secure)
    // =====================================
    public LeaveRequest updateLeaveStatus(String workspaceId, String leaveId, String status) {
        LeaveRequest leave = getLeaveById(workspaceId, leaveId);
        leave.setStatus(status);
        return repo.save(leave);
    }
}
