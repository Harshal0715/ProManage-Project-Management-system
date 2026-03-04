package com.project.management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.management.dto.TaskProgressRequest;
import com.project.management.model.Task;
import com.project.management.service.TaskService;

@RestController
@RequestMapping("/api/workspaces/{workspaceId}/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // =====================================
    // ✅ CREATE TASK
    // =====================================
    @PostMapping
    public Task createTask(@PathVariable String workspaceId,
                           @RequestBody Task task) {
        return service.createTask(workspaceId, task);
    }

    // =====================================
    // ✅ GET ALL TASKS (Workspace Scoped)
    // =====================================
    @GetMapping
    public List<Task> getTasks(@PathVariable String workspaceId) {
        return service.getTasksByWorkspace(workspaceId);
    }

    // =====================================
    // ✅ GET BY ID
    // =====================================
    @GetMapping("/{taskId}")
    public Task getTaskById(@PathVariable String workspaceId,
                            @PathVariable String taskId) {
        return service.getTaskById(workspaceId, taskId);
    }

    // =====================================
    // ✅ GET BY EMPLOYEE (ALL STATUSES)
    // =====================================
    @GetMapping("/employee/{employeeId}")
    public List<Task> getTasksByEmployee(@PathVariable String workspaceId,
                                         @PathVariable String employeeId) {
        // Always return all tasks for employee, no status filter
        return service.getTasksByEmployee(workspaceId, employeeId);
    }

    // =====================================
    // ✅ GET BY PROJECT
    // =====================================
    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable String workspaceId,
                                        @PathVariable String projectId) {
        return service.getTasksByProject(workspaceId, projectId);
    }

    // =====================================
    // ✅ STATUS UPDATE
    // =====================================
    @PutMapping("/{taskId}/status")
    public Task updateTaskStatus(@PathVariable String workspaceId,
                                 @PathVariable String taskId,
                                 @RequestParam String status) {
        return service.updateTaskStatus(workspaceId, taskId, status);
    }

    // =====================================
    // ✅ EMPLOYEE PROGRESS UPDATE
    // =====================================
    @PutMapping("/{taskId}/progress")
    public Task updateProgress(@PathVariable String workspaceId,
                               @PathVariable String taskId,
                               @RequestBody TaskProgressRequest req) {
        return service.updateTask(workspaceId, taskId, new Task() {{
            setProgressNote(req.getProgressNote());
            setProofLink(req.getProofLink());
        }});
    }

    // =====================================
    // ✅ ADMIN FULL EDIT
    // =====================================
    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable String workspaceId,
                           @PathVariable String taskId,
                           @RequestBody Task task) {
        return service.updateTask(workspaceId, taskId, task);
    }

    // =====================================
    // ✅ DELETE
    // =====================================
    @DeleteMapping("/{taskId}")
    public void deleteTask(@PathVariable String workspaceId,
                           @PathVariable String taskId) {
        service.deleteTask(workspaceId, taskId);
    }
}
