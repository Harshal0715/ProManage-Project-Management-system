package com.project.management.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "employees")
@CompoundIndex(name = "workspace_email_unique", def = "{'workspaceId': 1, 'email': 1}", unique = true)
public class Employee {

    @Id
    private String id;

    private String name;
    private String email;

    // ✅ System role (fixed: EMPLOYEE)
    private String role;

    // ✅ Job role/designation (Tester, QA, Developer, etc.)
    private String designation;

    private String department;
    private String workspaceId;

    // 🔥 NEW FIELD: password
    private String password;

    @org.springframework.data.annotation.PersistenceCreator
    public Employee() {
    }

    public Employee(String name, String email, String role, String designation,
            String department, String workspaceId, String password) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.designation = designation;
        this.department = department;
        this.workspaceId = workspaceId;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(String workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", designation='" + designation + '\'' +
                ", department='" + department + '\'' +
                ", workspaceId='" + workspaceId + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
