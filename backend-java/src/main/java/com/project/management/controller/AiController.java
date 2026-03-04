package com.project.management.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.management.ai.AiPredictionRequest;
import com.project.management.ai.AiPredictionResponse;
import com.project.management.repository.TaskRepository;
import com.project.management.service.AiService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/ai")
@CrossOrigin
public class AiController {

    private final TaskRepository taskRepository;
    private final AiService aiService;

    public AiController(TaskRepository taskRepository,
                        AiService aiService) {
        this.taskRepository = taskRepository;
        this.aiService = aiService;
    }

    // =====================================
    // ✅ Project AI prediction (Workspace Scoped)
    // =====================================
    @GetMapping("/project/{projectId}")
    public AiPredictionResponse predictProjectRisk(
            @PathVariable String workspaceId,
            @PathVariable String projectId) {

        long pending = taskRepository
                .countByWorkspaceIdAndProjectIdAndStatus(
                        workspaceId, projectId, "Pending");

        long inProgress = taskRepository
                .countByWorkspaceIdAndProjectIdAndStatus(
                        workspaceId, projectId, "InProgress");

        AiPredictionRequest req = new AiPredictionRequest();
        req.setPendingTasks((int) pending);
        req.setInProgressTasks((int) inProgress);

        req.setRejectedLeaves(0);
        req.setApprovedLeaves(0);

        return aiService.predict(workspaceId, req);
    }
}