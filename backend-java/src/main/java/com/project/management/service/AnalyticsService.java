package com.project.management.service;

import org.springframework.stereotype.Service;

import com.project.management.dto.AdminAnalyticsResponse;
import com.project.management.dto.EmployeeAnalyticsResponse;
import com.project.management.repository.EmployeeRepository;
import com.project.management.repository.LeaveRepository;
import com.project.management.repository.TaskRepository;

@Service
public class AnalyticsService {

    private static final String STATUS_PENDING = "Pending";
    private static final String STATUS_IN_PROGRESS = "InProgress";
    private static final String STATUS_DONE = "Done";

    private static final String LEAVE_APPROVED = "Approved";
    private static final String LEAVE_REJECTED = "Rejected";

    private final TaskRepository taskRepository;
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public AnalyticsService(TaskRepository taskRepository,
                            LeaveRepository leaveRepository,
                            EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.leaveRepository = leaveRepository;
        this.employeeRepository = employeeRepository;
    }

    // =====================================
    // ✅ Employee Analytics (Workspace Scoped)
    // =====================================
    public EmployeeAnalyticsResponse getEmployeeAnalytics(String workspaceId,
                                                          String employeeId) {

        long totalTasks =
                taskRepository.countByWorkspaceIdAndEmployeeId(workspaceId, employeeId);

        long doneTasks =
                taskRepository.countByWorkspaceIdAndEmployeeIdAndStatus(
                        workspaceId, employeeId, STATUS_DONE);

        long inProgressTasks =
                taskRepository.countByWorkspaceIdAndEmployeeIdAndStatus(
                        workspaceId, employeeId, STATUS_IN_PROGRESS);

        long pendingTasks =
                taskRepository.countByWorkspaceIdAndEmployeeIdAndStatus(
                        workspaceId, employeeId, STATUS_PENDING);

        long totalLeaves =
                leaveRepository.countByWorkspaceIdAndEmployeeId(workspaceId, employeeId);

        long approvedLeaves =
                leaveRepository.countByWorkspaceIdAndEmployeeIdAndStatus(
                        workspaceId, employeeId, LEAVE_APPROVED);

        long rejectedLeaves =
                leaveRepository.countByWorkspaceIdAndEmployeeIdAndStatus(
                        workspaceId, employeeId, LEAVE_REJECTED);

        int workloadScore = (int) Math.min(
                100,
                (pendingTasks * 15) + (inProgressTasks * 25)
        );

        EmployeeAnalyticsResponse response = new EmployeeAnalyticsResponse();
        response.setEmployeeId(employeeId);

        response.setTotalTasks(totalTasks);
        response.setDoneTasks(doneTasks);
        response.setInProgressTasks(inProgressTasks);
        response.setPendingTasks(pendingTasks);

        response.setTotalLeaves(totalLeaves);
        response.setApprovedLeaves(approvedLeaves);
        response.setRejectedLeaves(rejectedLeaves);

        response.setWorkloadScore(workloadScore);

        return response;
    }

    // =====================================
    // ✅ Admin Analytics (Workspace Scoped)
    // =====================================
    public AdminAnalyticsResponse getAdminAnalytics(String workspaceId) {

        long totalEmployees =
                employeeRepository.findByWorkspaceId(workspaceId).size();

        long totalTasks =
                taskRepository.findByWorkspaceId(workspaceId).size();

        long pendingTasks =
                taskRepository.countByWorkspaceIdAndStatus(workspaceId, STATUS_PENDING);

        long inProgressTasks =
                taskRepository.countByWorkspaceIdAndStatus(workspaceId, STATUS_IN_PROGRESS);

        long doneTasks =
                taskRepository.countByWorkspaceIdAndStatus(workspaceId, STATUS_DONE);

        long totalLeaves =
                leaveRepository.findByWorkspaceId(workspaceId).size();

        long approvedLeaves =
                leaveRepository.countByWorkspaceIdAndStatus(workspaceId, LEAVE_APPROVED);

        long rejectedLeaves =
                leaveRepository.countByWorkspaceIdAndStatus(workspaceId, LEAVE_REJECTED);

        AdminAnalyticsResponse response = new AdminAnalyticsResponse();

        response.setTotalEmployees(totalEmployees);
        response.setTotalTasks(totalTasks);
        response.setPendingTasks(pendingTasks);
        response.setInProgressTasks(inProgressTasks);
        response.setDoneTasks(doneTasks);

        response.setTotalLeaves(totalLeaves);
        response.setApprovedLeaves(approvedLeaves);
        response.setRejectedLeaves(rejectedLeaves);

        double completionRate = totalTasks == 0
                ? 0
                : ((double) doneTasks / totalTasks) * 100;

        double rejectionRate = totalLeaves == 0
                ? 0
                : ((double) rejectedLeaves / totalLeaves) * 100;

        response.setTaskCompletionRate(
                Math.round(completionRate * 100.0) / 100.0
        );

        response.setLeaveRejectionRate(
                Math.round(rejectionRate * 100.0) / 100.0
        );

        return response;
    }
}