import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// ✅ REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  (config) => {

    // 🔐 JWT (future ready)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// ✅ RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error?.response?.data || error.message);

    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ==========================================
// 🔥 WORKSPACE HELPER FUNCTIONS
// ==========================================

export const workspaceApi = {

  getWorkspaceId() {
    return localStorage.getItem("workspaceId");
  },

  requireWorkspace() {
    const workspaceId = this.getWorkspaceId();
    if (!workspaceId) {
      console.warn("Workspace ID missing. Redirecting to login.");
      localStorage.clear();
      window.location.href = "/login";
    }
    return workspaceId;
  },

  // ========================
  // PROJECTS
  // ========================
  getProjects() {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/projects`);
  },

  getProjectById(projectId) {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/projects/${projectId}`);
  },

  createProject(data) {
    const workspaceId = this.requireWorkspace();
    return api.post(`/api/workspaces/${workspaceId}/projects`, data);
  },

  // ========================
  // TASKS
  // ========================
  getTasks() {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/tasks`);
  },

  getTasksByProject(projectId) {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/tasks/project/${projectId}`);
  },

  createTask(data) {
    const workspaceId = this.requireWorkspace();
    return api.post(`/api/workspaces/${workspaceId}/tasks`, data);
  },

  updateTaskStatus(taskId, status) {
    const workspaceId = this.requireWorkspace();
    return api.put(`/api/workspaces/${workspaceId}/tasks/${taskId}/status`, {
      status,
    });
  },

  // ========================
  // EMPLOYEES
  // ========================
  getEmployees() {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/members`);
  },

  createEmployee(data) {
    const workspaceId = this.requireWorkspace();
    return api.post(`/api/workspaces/${workspaceId}/employees`, data);
  },

  deleteEmployee(id) {
    const workspaceId = this.requireWorkspace();
    return api.delete(`/api/workspaces/${workspaceId}/employees/${id}`);
  },

  // ========================
  // LEAVES
  // ========================
  getLeaves() {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/leaves`);
  },

  updateLeaveStatus(leaveId, status) {
    const workspaceId = this.requireWorkspace();
    return api.put(
      `/api/workspaces/${workspaceId}/leaves/${leaveId}/status?status=${status}`
    );
  },

  // ========================
  // ANALYTICS
  // ========================
  getAdminAnalytics() {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/analytics/admin`);
  },

  getEmployeeAnalytics(employeeId) {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/analytics/employee/${employeeId}`);
  },

  // ========================
  // AI
  // ========================
  getProjectRisk(projectId) {
    const workspaceId = this.requireWorkspace();
    return api.get(`/api/workspaces/${workspaceId}/ai/project/${projectId}`);
  },

  // ========================
  // EMPLOYEE WORKSPACES
  // ========================
  getEmployeeWorkspaces(employeeId) {
    return api.get(`/api/workspaces/employee/${employeeId}`);
  },

};