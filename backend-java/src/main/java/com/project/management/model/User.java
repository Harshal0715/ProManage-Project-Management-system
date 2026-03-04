package com.project.management.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    // 🔥 GLOBAL UNIQUE EMAIL (login once, choose workspace later)
    @Indexed(unique = true)
    private String email;

    private String password;

    // ADMIN or EMPLOYEE
    private String role;

    /*
        🔥 Workspace rule:
        - ADMIN → workspaceId = null (can own multiple workspaces)
        - EMPLOYEE → workspaceId = required
    */
    private String workspaceId;

    // Only for employee users
    private String employeeId;

    private boolean firstLogin = true;

    public User() {}

    // ===== ID =====
    public String getId() {
        return id;
    }

    // ===== Name =====
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ===== Email =====
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // ===== Password =====
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // ===== Role =====
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // ===== Workspace =====
    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    // ===== Employee =====
    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    // ===== First Login =====
    public boolean isFirstLogin() {
        return firstLogin;
    }

    public void setFirstLogin(boolean firstLogin) {
        this.firstLogin = firstLogin;
    }
}