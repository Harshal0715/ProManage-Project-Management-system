package com.project.management.dto;

public class EmployeeAnalyticsResponse {

    private String employeeId;

    private long totalTasks;
    private long doneTasks;
    private long inProgressTasks;
    private long pendingTasks;

    private long totalLeaves;
    private long approvedLeaves;
    private long rejectedLeaves;

    // 0–100 score based on workload formula
    private int workloadScore;

    public EmployeeAnalyticsResponse() {
    }

    public EmployeeAnalyticsResponse(
            String employeeId,
            long totalTasks,
            long doneTasks,
            long inProgressTasks,
            long pendingTasks,
            long totalLeaves,
            long approvedLeaves,
            long rejectedLeaves,
            int workloadScore) {

        this.employeeId = employeeId;
        this.totalTasks = totalTasks;
        this.doneTasks = doneTasks;
        this.inProgressTasks = inProgressTasks;
        this.pendingTasks = pendingTasks;
        this.totalLeaves = totalLeaves;
        this.approvedLeaves = approvedLeaves;
        this.rejectedLeaves = rejectedLeaves;
        this.workloadScore = workloadScore;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getDoneTasks() {
        return doneTasks;
    }

    public void setDoneTasks(long doneTasks) {
        this.doneTasks = doneTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getTotalLeaves() {
        return totalLeaves;
    }

    public void setTotalLeaves(long totalLeaves) {
        this.totalLeaves = totalLeaves;
    }

    public long getApprovedLeaves() {
        return approvedLeaves;
    }

    public void setApprovedLeaves(long approvedLeaves) {
        this.approvedLeaves = approvedLeaves;
    }

    public long getRejectedLeaves() {
        return rejectedLeaves;
    }

    public void setRejectedLeaves(long rejectedLeaves) {
        this.rejectedLeaves = rejectedLeaves;
    }

    public int getWorkloadScore() {
        return workloadScore;
    }

    public void setWorkloadScore(int workloadScore) {
        this.workloadScore = workloadScore;
    }

    @Override
    public String toString() {
        return "EmployeeAnalyticsResponse{" +
                "employeeId='" + employeeId + '\'' +
                ", totalTasks=" + totalTasks +
                ", doneTasks=" + doneTasks +
                ", inProgressTasks=" + inProgressTasks +
                ", pendingTasks=" + pendingTasks +
                ", totalLeaves=" + totalLeaves +
                ", approvedLeaves=" + approvedLeaves +
                ", rejectedLeaves=" + rejectedLeaves +
                ", workloadScore=" + workloadScore +
                '}';
    }
}
