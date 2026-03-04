import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/api";
import { useWorkspace } from "../context/WorkspaceContext";

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  Calendar,
  BarChart3,
  Bell,
  LogOut,
  Shield,
  Layers,
  ChevronDown,
  Plus,
  User,
} from "lucide-react";

import WorkspaceModal from "./WorkspaceModal";

export default function Layout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ USE CONTEXT
  const { workspaceId, workspaceName, role, name, changeWorkspace } = useWorkspace();

  const [workspaces, setWorkspaces] = useState([]);
  const [openWorkspaceModal, setOpenWorkspaceModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // =============================================
  // FETCH WORKSPACES (ADMIN)
  // =============================================
  const fetchWorkspaces = async () => {
    try {
      if (!user?.userId) return;

      const res = await api.get(`/api/workspaces/owner/${user.userId}`);
      const data = res.data || [];
      setWorkspaces(data);

      // If no workspace selected yet, auto select first
      if (!workspaceId && data.length > 0) {
        changeWorkspace(data[0].id, data[0].name);
      }
    } catch (err) {
      console.log("Workspace load failed", err);
    }
  };

  useEffect(() => {
    if (role === "ADMIN") {
      fetchWorkspaces();
    }
  }, []);

  // =============================================
  // CLOSE DROPDOWN
  // =============================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition font-medium ${isActive(to)
        ? "bg-blue-600 text-white shadow"
        : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">

        {/* ================= SIDEBAR ================= */}
        <aside className="w-72 bg-white border-r min-h-screen px-5 py-6 flex flex-col">

          {/* WORKSPACE SWITCHER */}
          {role === "ADMIN" && (
            <div className="mb-6 relative" ref={dropdownRef}>
              <div
                onClick={() => setOpenDropdown((s) => !s)}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {workspaceName?.[0] || "W"}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {workspaceName || "Select Workspace"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {workspaces.length} workspace(s)
                    </p>
                  </div>
                </div>

                <ChevronDown size={18} />
              </div>

              {openDropdown && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg border rounded-xl z-50 overflow-hidden">
                  {workspaces.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        changeWorkspace(w.id, w.name); // ✅ CONTEXT UPDATE
                        setOpenDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-100 text-sm ${workspaceId === w.id ? "bg-blue-50 font-semibold" : ""
                        }`}
                    >
                      {w.name}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setOpenDropdown(false);
                      setOpenWorkspaceModal(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-gray-100 border-t"
                  >
                    <Plus size={16} />
                    Create Workspace
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ROLE BADGE */}
          <div className="mb-6">
            {role === "ADMIN" ? (
              <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 text-blue-700 flex items-center gap-1 w-fit">
                <Shield size={14} /> ADMIN • {name}
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                <User size={14} /> EMPLOYEE • {name}
              </span>
            )}
          </div>

          {/* MENU */}
          <div className="space-y-2">

            {role === "ADMIN" && (
              <>
                <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/admin/workspaces" icon={Layers} label="Workspaces" />
                <NavItem to="/admin/projects" icon={FolderKanban} label="Projects" />
                <NavItem to="/admin/tasks" icon={ListTodo} label="Task Board" />
                <NavItem to="/admin/employees" icon={Users} label="Employees" />
                <NavItem to="/admin/leaves" icon={Calendar} label="Leave Requests" />
                <NavItem to="/admin/analytics" icon={BarChart3} label="Analytics" />
                {/* Modernized Team Discussion */}
                <NavItem to="/admin/discussion" icon={Users} label="💬 Team Discussion" />
              </>
            )}

            {role === "EMPLOYEE" && (
              <>
                <NavItem to="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/employee/tasks" icon={ListTodo} label="My Tasks" />
                <NavItem to="/employee/leaves" icon={Calendar} label="Apply Leave" />
                <NavItem to="/employee/notifications" icon={Bell} label="Notifications" />
                <NavItem to="/employee/team" icon={Users} label="Team Members" />
                {/* Modernized Team Discussion */}
                <NavItem to="/employee/discussion" icon={Users} label="💬 Team Discussion" />
                <NavItem to="/employee/change-password" icon={Shield} label="Change Password" />
              </>
            )}
          </div>

          {/* LOGOUT */}
          <div className="mt-auto">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      <WorkspaceModal
        open={openWorkspaceModal}
        onClose={() => setOpenWorkspaceModal(false)}
        onCreated={fetchWorkspaces}
      />
    </div>
  );
}