package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    // ✅ GLOBAL LOGIN (no workspace required)
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // 🔥 Workspace scoped (for employees)
    Optional<User> findByWorkspaceIdAndEmail(String workspaceId, String email);

    boolean existsByWorkspaceIdAndEmail(String workspaceId, String email);

    long countByWorkspaceIdAndRole(String workspaceId, String role);

    Optional<User> findByWorkspaceIdAndId(String workspaceId, String id);

    List<User> findByWorkspaceId(String workspaceId);
}