import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";

// ✅ Admin Pages
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import LeaveRequests from "./pages/LeaveRequests";
import Analytics from "./pages/Analytics";
import ProjectBoard from "./pages/ProjectBoard";
import Workspaces from "./pages/Workspaces";

// ✅ Employee Pages
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeTasks from "./pages/EmployeeTasks";
import EmployeeLeaves from "./pages/EmployeeLeaves";
import EmployeeNotifications from "./pages/EmployeeNotifications";
import ChangePassword from "./pages/ChangePassword";
import EmployeeTeam from "./pages/EmployeeTeam";

import { WorkspaceProvider } from "./context/WorkspaceContext";
import SignupCompany from "./pages/SignupCompany"; 
import ForgotPassword from "./pages/ForgotPassword";
import CreateWorkspace from "./pages/CreateWorkspace";
import Discussion from "./pages/Discussion";

/* ======================================================
   ✅ SMART ROOT REDIRECT
====================================================== */
function RootRedirect() {
  const role = localStorage.getItem("role")?.toUpperCase();

  if (!role) return <Navigate to="/login" replace />;

  if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (role === "EMPLOYEE") return <Navigate to="/employee/dashboard" replace />;

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <WorkspaceProvider>
      <BrowserRouter>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================== */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup-company" element={<SignupCompany />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* =========================
              ROOT AUTO REDIRECT
          ========================== */}
          <Route path="/" element={<RootRedirect />} />

          {/* =========================
              ADMIN ROUTES
          ========================== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/workspaces"
            element={
              <ProtectedRoute role="ADMIN">
                <Workspaces />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute role="ADMIN">
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute role="ADMIN">
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects/:id/board"
            element={
              <ProtectedRoute role="ADMIN">
                <ProjectBoard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tasks"
            element={
              <ProtectedRoute role="ADMIN">
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute role="ADMIN">
                <LeaveRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute role="ADMIN">
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* =========================
              EMPLOYEE ROUTES
          ========================== */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeTasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/leaves"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeLeaves />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee/notifications"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <EmployeeNotifications />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/employee/team" 
            element={<EmployeeTeam />
            }
          />

          <Route
            path="/employee/change-password"
            element={
              <ProtectedRoute role="EMPLOYEE">
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/employee/discussion" 
            element={
              <ProtectedRoute role="EMPLOYEE">
                <Discussion />
              </ProtectedRoute>
            }
          />

          <Route 
          path="/admin/discussion" 
          element={<Discussion />} />


          {/* =========================
              ONBOARDING FLOW
          ========================== */}
          <Route  
            path="/create-workspace"
            element={
              <ProtectedRoute role="ADMIN">
                <CreateWorkspace />
              </ProtectedRoute>
            }
          />

          {/* =========================
              FALLBACK
          ========================== */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </WorkspaceProvider>
  );
}
