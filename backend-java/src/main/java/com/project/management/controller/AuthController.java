package com.project.management.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.management.model.User;
import com.project.management.model.Employee;
import com.project.management.repository.UserRepository;
import com.project.management.repository.EmployeeRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;

    public AuthController(UserRepository userRepo, EmployeeRepository employeeRepo) {
        this.userRepo = userRepo;
        this.employeeRepo = employeeRepo;
    }

    // =====================================
    // ✅ LOGIN (Admin + Employee)
    // =====================================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String workspaceId = body.get("workspaceId");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email and password are required"));
        }

        // 1. Try User collection (Admin or Employee)
        User user = userRepo.findByEmail(email).orElse(null);
        if (user != null) {
            if (!user.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid password"));
            }
            Map<String, Object> res = new HashMap<>();
            res.put("message", "Login successful");
            res.put("userId", user.getId());
            res.put("name", user.getName());
            res.put("role", user.getRole()); // ✅ FIX: use actual role from DB
            res.put("workspaceId", user.getWorkspaceId());
            res.put("employeeId", user.getEmployeeId());
            res.put("ownerId", user.getId());
            return ResponseEntity.ok(res);
        }

        // 2. Try Employee collection (scoped by workspace)
        if (workspaceId != null) {
            Employee emp = employeeRepo.findByWorkspaceIdAndEmail(workspaceId, email).orElse(null);
            if (emp != null) {
                if (emp.getPassword() == null || !emp.getPassword().equals(password)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("error", "Invalid password"));
                }
                Map<String, Object> res = new HashMap<>();
                res.put("message", "Login successful");
                res.put("employeeId", emp.getId());
                res.put("name", emp.getName());
                res.put("email", emp.getEmail());
                res.put("role", "EMPLOYEE"); // ✅ employees always have EMPLOYEE system role
                res.put("workspaceId", emp.getWorkspaceId());
                res.put("userId", emp.getId());
                res.put("ownerId", emp.getWorkspaceId());
                return ResponseEntity.ok(res);
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));
    }

    // =====================================
    // ✅ REGISTER ADMIN
    // =====================================
    @PostMapping("/register-admin")
    public User registerAdmin(@RequestBody User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setRole("ADMIN");
        user.setWorkspaceId(null);
        user.setEmployeeId(null);
        return userRepo.save(user);
    }

    // =====================================
    // ✅ REGISTER EMPLOYEE (via User table if needed)
    // =====================================
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setRole("EMPLOYEE");
        return userRepo.save(user);
    }

    // =====================================
    // ✅ CHANGE PASSWORD
    // =====================================
    @PutMapping("/change-password")
    public Map<String, String> changePassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("newPassword");
        String workspaceId = body.get("workspaceId");

        if (email == null || newPassword == null) {
            throw new RuntimeException("Email and newPassword are required");
        }

        User user = userRepo.findByEmail(email).orElse(null);
        if (user != null) {
            user.setPassword(newPassword);
            userRepo.save(user);
            return Map.of("message", "Password updated successfully");
        }

        if (workspaceId != null) {
            Employee emp = employeeRepo.findByWorkspaceIdAndEmail(workspaceId, email).orElse(null);
            if (emp != null) {
                emp.setPassword(newPassword);
                employeeRepo.save(emp);
                return Map.of("message", "Password updated successfully");
            }
        }

        throw new RuntimeException("User not found");
    }

    // =====================================
    // ✅ FORGOT PASSWORD
    // =====================================
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            throw new RuntimeException("Email is required");
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return Map.of("message", "Password reset link sent to " + email);
    }
}
