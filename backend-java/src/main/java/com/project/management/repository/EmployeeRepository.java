package com.project.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.Employee;

public interface EmployeeRepository extends MongoRepository<Employee, String> {

    // 🔥 Workspace isolation (MOST IMPORTANT)
    List<Employee> findByWorkspaceId(String workspaceId);

    Optional<Employee> findByWorkspaceIdAndId(String workspaceId, String id);

    Optional<Employee> findByWorkspaceIdAndEmail(String workspaceId, String email);

    List<Employee> findByWorkspaceIdAndDepartment(String workspaceId, String department);

    List<Employee> findByWorkspaceIdAndRole(String workspaceId, String role);

    List<Employee> findByWorkspaceIdOrderByNameAsc(String workspaceId);
}