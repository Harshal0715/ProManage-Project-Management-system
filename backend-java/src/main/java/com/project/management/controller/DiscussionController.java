package com.project.management.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.project.management.model.Discussion;
import com.project.management.repository.DiscussionRepository;
import com.project.management.repository.EmployeeRepository;
import com.project.management.repository.UserRepository;

@RestController
@RequestMapping("/api/workspaces")
@CrossOrigin
public class DiscussionController {

    private final DiscussionRepository repo;
    private final EmployeeRepository employeeRepo;
    private final UserRepository userRepo;

    public DiscussionController(DiscussionRepository repo,
                                EmployeeRepository employeeRepo,
                                UserRepository userRepo) {
        this.repo = repo;
        this.employeeRepo = employeeRepo;
        this.userRepo = userRepo;
    }

    // ✅ Post a new message
    @PostMapping("/{workspaceId}/discussions")
    public Discussion postMessage(
            @PathVariable String workspaceId,
            @RequestBody Discussion msg) {
        msg.setWorkspaceId(workspaceId);
        msg.setTimestamp(LocalDateTime.now());

        // Enrich senderName if not provided
        if (msg.getSenderName() == null || msg.getSenderName().isBlank()) {
            // Try Employee lookup
            employeeRepo.findByWorkspaceIdAndId(workspaceId, msg.getSenderId())
                .ifPresentOrElse(
                    emp -> msg.setSenderName(emp.getName()),
                    () -> {
                        // Fallback: check User table (admins)
                        userRepo.findById(msg.getSenderId())
                            .ifPresent(user -> msg.setSenderName(user.getName()));
                    }
                );

            // Final fallback
            if (msg.getSenderName() == null || msg.getSenderName().isBlank()) {
                msg.setSenderName("Unknown");
            }
        }

        return repo.save(msg);
    }

    // ✅ Get all messages for a workspace
    @GetMapping("/{workspaceId}/discussions")
    public List<Discussion> getMessages(@PathVariable String workspaceId) {
        return repo.findByWorkspaceIdOrderByTimestampAsc(workspaceId);
    }
}
