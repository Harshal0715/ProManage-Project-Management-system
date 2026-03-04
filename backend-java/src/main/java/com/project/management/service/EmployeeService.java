package com.project.management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.management.model.Employee;
import com.project.management.model.User;
import com.project.management.repository.EmployeeRepository;
import com.project.management.repository.UserRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final UserRepository userRepository;

    public EmployeeService(EmployeeRepository repository,
            UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    // =====================================
    // ✅ ADD EMPLOYEE
    // =====================================
    public Employee addEmployee(String workspaceId, Employee employee) {
        employee.setWorkspaceId(workspaceId);

        // ✅ Always force system role to EMPLOYEE
        employee.setRole("EMPLOYEE");

        // ✅ Keep designation as provided (Tester, QA, Developer, etc.)
        // No need to override employee.setDesignation()

        Employee saved = repository.save(employee);

        // 🔥 Create login if not exists, or update to latest workspace
        java.util.Optional<User> existingUserOpt = userRepository.findByEmail(saved.getEmail());
        if (existingUserOpt.isEmpty()) {
            User user = new User();
            user.setName(saved.getName());
            user.setEmail(saved.getEmail());
            user.setRole("EMPLOYEE"); // ✅ consistent system role
            user.setEmployeeId(saved.getId());
            user.setWorkspaceId(workspaceId);
            user.setPassword("1234"); // Later we hash

            userRepository.save(user);
        } else {
            User existingUser = existingUserOpt.get();
            // Update the user to log into the most recent workspace they were added to
            existingUser.setWorkspaceId(workspaceId);
            existingUser.setEmployeeId(saved.getId());
            userRepository.save(existingUser);
        }

        return saved;
    }

    // =====================================
    // ✅ GET ALL BY WORKSPACE
    // =====================================
    public List<Employee> getEmployeesByWorkspace(String workspaceId) {
        return repository.findByWorkspaceId(workspaceId);
    }

    // =====================================
    // ✅ GET BY ID
    // =====================================
    public Employee getEmployeeById(String workspaceId, String employeeId) {
        return repository.findByWorkspaceIdAndId(workspaceId, employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // =====================================
    // ✅ DELETE EMPLOYEE
    // =====================================
    public void deleteEmployee(String workspaceId, String employeeId) {
        Employee emp = getEmployeeById(workspaceId, employeeId);

        // 🔥 Delete linked user globally
        userRepository.findByEmail(emp.getEmail())
                .ifPresent(userRepository::delete);

        repository.delete(emp);
    }
}
