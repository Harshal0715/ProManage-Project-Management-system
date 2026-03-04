package com.project.management.dto;

public class AdminAnalyticsResponse {

    private long totalEmployees;

    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long doneTasks;

    private long totalLeaves;
    private long approvedLeaves;
    private long rejectedLeaves;

    // percentages (0–100)
    private double taskCompletionRate;
    private double leaveRejectionRate;

    public AdminAnalyticsResponse() {
    }

    public AdminAnalyticsResponse(
            long totalEmployees,
            long totalTasks,
            long pendingTasks,
            long inProgressTasks,
            long doneTasks,
            long totalLeaves,
            long approvedLeaves,
            long rejectedLeaves,
            double taskCompletionRate,
            double leaveRejectionRate) {

        this.totalEmployees = totalEmployees;
        this.totalTasks = totalTasks;
        this.pendingTasks = pendingTasks;
        this.inProgressTasks = inProgressTasks;
        this.doneTasks = doneTasks;
        this.totalLeaves = totalLeaves;
        this.approvedLeaves = approvedLeaves;
        this.rejectedLeaves = rejectedLeaves;
        this.taskCompletionRate = taskCompletionRate;
        this.leaveRejectionRate = leaveRejectionRate;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public long getDoneTasks() {
        return doneTasks;
    }

    public void setDoneTasks(long doneTasks) {
        this.doneTasks = doneTasks;
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

    public double getTaskCompletionRate() {
        return taskCompletionRate;
    }

    public void setTaskCompletionRate(double taskCompletionRate) {
        this.taskCompletionRate = taskCompletionRate;
    }

    public double getLeaveRejectionRate() {
        return leaveRejectionRate;
    }

    public void setLeaveRejectionRate(double leaveRejectionRate) {
        this.leaveRejectionRate = leaveRejectionRate;
    }

    @Override
    public String toString() {
        return "AdminAnalyticsResponse{" +
                "totalEmployees=" + totalEmployees +
                ", totalTasks=" + totalTasks +
                ", pendingTasks=" + pendingTasks +
                ", inProgressTasks=" + inProgressTasks +
                ", doneTasks=" + doneTasks +
                ", totalLeaves=" + totalLeaves +
                ", approvedLeaves=" + approvedLeaves +
                ", rejectedLeaves=" + rejectedLeaves +
                ", taskCompletionRate=" + taskCompletionRate +
                ", leaveRejectionRate=" + leaveRejectionRate +
                '}';
    }
}
