package com.project.management.ai;

public class AiPredictionRequest {

    private int pendingTasks;
    private int inProgressTasks;
    private int rejectedLeaves;
    private int approvedLeaves;

    public AiPredictionRequest() {}

    public int getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(int pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public int getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(int inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
    }

    public int getRejectedLeaves() {
        return rejectedLeaves;
    }

    public void setRejectedLeaves(int rejectedLeaves) {
        this.rejectedLeaves = rejectedLeaves;
    }

    public int getApprovedLeaves() {
        return approvedLeaves;
    }

    public void setApprovedLeaves(int approvedLeaves) {
        this.approvedLeaves = approvedLeaves;
    }
}
