package com.project.management.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.project.management.model.Project;
import com.project.management.model.Task;
import com.project.management.repository.ProjectRepository;
import com.project.management.repository.TaskRepository;

@Service
public class TaskService {

    private static final Set<String> VALID_STATUS =
            Set.of("Pending", "InProgress", "Done");

    private final TaskRepository repository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    public TaskService(TaskRepository repository,
                       ProjectRepository projectRepository,
                       NotificationService notificationService) {
        this.repository = repository;
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
    }

    // =====================================
    // ✅ CREATE TASK (workspace required)
    // =====================================
    public Task createTask(String workspaceId, Task task) {
        String normalized = normalizeStatus(task.getStatus());
        task.setStatus(normalized);

        // 🔥 attach workspace safely
        attachWorkspaceFromProject(workspaceId, task);

        Task saved = repository.save(task);

        if (saved.getEmployeeId() != null && !saved.getEmployeeId().isBlank()) {
            notificationService.createNotification(
                workspaceId,
                saved.getEmployeeId(),
                "📌 New task assigned: " + saved.getTitle()
            );
        }

        return saved;
    }

    // =====================================
    // ✅ READ (workspace filtered)
    // =====================================
    public List<Task> getTasksByWorkspace(String workspaceId) {
        return repository.findByWorkspaceId(workspaceId);
    }

    public Task getTaskById(String workspaceId, String taskId) {
        return repository.findByWorkspaceIdAndId(workspaceId, taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public List<Task> getTasksByEmployee(String workspaceId, String employeeId) {
        return repository.findByWorkspaceIdAndEmployeeId(workspaceId, employeeId);
    }

    public List<Task> getTasksByProject(String workspaceId, String projectId) {
        return repository.findByWorkspaceIdAndProjectId(workspaceId, projectId);
    }

    // =====================================
    // ✅ STATUS UPDATE (secure)
    // =====================================
    public Task updateTaskStatus(String workspaceId, String taskId, String status) {
        String normalized = normalizeStatus(status);

        Task task = getTaskById(workspaceId, taskId);
        String oldStatus = task.getStatus();

        task.setStatus(normalized);
        task.setWorkspaceId(workspaceId); // ✅ ensure workspace stays linked

        Task saved = repository.save(task);

        if (!oldStatus.equals(normalized)
            && "Done".equals(normalized)
            && saved.getEmployeeId() != null) {
            notificationService.createNotification(
                workspaceId,
                saved.getEmployeeId(),
                "✅ Task completed: " + saved.getTitle()
            );
        }

        return saved;
    }

    // =====================================
    // ✅ UPDATE FULL TASK
    // =====================================
    public Task updateTask(String workspaceId, String taskId, Task updatedTask) {
        Task task = getTaskById(workspaceId, taskId);

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());

        if (updatedTask.getStatus() != null) {
            String normalized = normalizeStatus(updatedTask.getStatus());
            task.setStatus(normalized);
        }

        task.setEmployeeId(updatedTask.getEmployeeId());
        task.setWorkspaceId(workspaceId); // ✅ preserve workspace

        return repository.save(task);
    }

    // =====================================
    // ✅ DELETE (secure)
    // =====================================
    public void deleteTask(String workspaceId, String taskId) {
        Task task = getTaskById(workspaceId, taskId);
        repository.delete(task);
    }

    // =====================================
    // 🔥 SAFE PROJECT VALIDATION
    // =====================================
    private void attachWorkspaceFromProject(String workspaceId, Task task) {
        if (task.getProjectId() == null) {
            throw new RuntimeException("Project is required");
        }

        Project project = projectRepository
                .findByWorkspaceIdAndId(workspaceId, task.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found in this workspace"));

        task.setWorkspaceId(project.getWorkspaceId());
    }

    // =====================================
    // ✅ STATUS NORMALIZATION
    // =====================================
    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) return "Pending";
        switch (status.trim().toLowerCase()) {
            case "pending":
                return "Pending";
            case "inprogress":
            case "in_progress":
            case "in progress":
                return "InProgress";
            case "done":
            case "completed":
                return "Done";
            default:
                throw new RuntimeException("Invalid status: " + status);
        }
    }
}
