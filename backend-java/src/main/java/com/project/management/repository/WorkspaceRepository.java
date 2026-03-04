package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.Workspace;

public interface WorkspaceRepository extends MongoRepository<Workspace, String> {

    // 🔥 Owner-based filtering
    List<Workspace> findByOwnerId(String ownerId);

    Optional<Workspace> findByIdAndOwnerId(String id, String ownerId);

    // Optional helpers
    Optional<Workspace> findByOwnerIdAndName(String ownerId, String name);

    List<Workspace> findByActiveTrueOrderByNameAsc();

    // ✅ Employee-based filtering
    // Assuming Workspace has a field like List<String> employeeIds
    List<Workspace> findByEmployeeIdsContains(String employeeId);
}
