import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { workspaceApi } from "../api/api";
import { useWorkspace } from "../context/WorkspaceContext";
import ProjectModal from "../components/ProjectModal";

import {
  Search,
  FolderKanban,
  Trash2,
  Plus,
  Bot,
  RefreshCcw,
  Sparkles,
  Layers,
  ArrowRight,
  UserCircle2
} from "lucide-react";

export default function Projects() {
  const navigate = useNavigate();
  const { workspaceId, workspaceName } = useWorkspace();

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiResults, setAiResults] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // ✅ Guard: if no workspace selected, show message instead of redirect
  if (!workspaceId) {
    return (
      <Layout>
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <Layers size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Workspace Selected</h3>
          <p className="text-gray-500 max-w-sm">
            Please create or select a workspace from the sidebar to view and manage projects.
          </p>
        </div>
      </Layout>
    );
  }

  // ==============================
  // LOAD PROJECTS
  // ==============================
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        workspaceApi.getProjects(),
        workspaceApi.getTasks(),
      ]);

      const rawProjects = projectsRes.data || [];
      const allTasks = tasksRes.data || [];

      // Compute actual progress per project based on task completion
      const enrichedList = rawProjects.map((p) => {
        const projectTasks = allTasks.filter((t) => t.projectId === p.id);
        const doneTasks = projectTasks.filter((t) => t.status === "Done");
        const calculatedProgress =
          projectTasks.length > 0
            ? Math.round((doneTasks.length / projectTasks.length) * 100)
            : 0;

        return {
          ...p,
          progressPercent: calculatedProgress,
        };
      });

      setProjects(enrichedList);
      enrichedList.forEach((p) => loadAi(p.id));
    } catch (err) {
      console.log("Project fetch failed:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD EMPLOYEES (For Modal)
  // ==============================
  const fetchEmployees = async () => {
    try {
      const res = await workspaceApi.getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.log("Employee fetch failed", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, [workspaceId]);

  // ==============================
  // AI RISK
  // ==============================
  const loadAi = async (projectId) => {
    try {
      const res = await workspaceApi.getProjectRisk(projectId);
      setAiResults((prev) => ({
        ...prev,
        [projectId]: res.data,
      }));
    } catch { }
  };

  const riskStyle = (risk) => {
    if (risk === "High")
      return "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10";
    if (risk === "Medium")
      return "bg-orange-50 text-orange-700 border-orange-200 shadow-sm shadow-orange-500/10";
    return "bg-teal-50 text-teal-700 border-teal-200 shadow-sm shadow-teal-500/10";
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Active": return "bg-brand-50 text-brand-700 border-brand-200";
      case "Completed": return "bg-teal-50 text-teal-700 border-teal-200";
      case "OnHold": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // ==============================
  // DELETE PROJECT
  // ==============================
  const deleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      await workspaceApi.deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // ==============================
  // FILTERED PROJECTS
  // ==============================
  const filtered = useMemo(() => {
    return projects.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? p.status === statusFilter : true) &&
      (priorityFilter ? p.priority === priorityFilter : true)
    );
  }, [projects, search, statusFilter, priorityFilter]);

  return (
    <Layout>
      {/* PREMIUM HEADER */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner">
              <FolderKanban className="text-teal-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              {workspaceName || "Workspace"} Projects
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md flex items-center gap-1.5">
              <Bot size={14} className="text-teal-400" />
              AI-powered tracking & risk insights for your teams
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 bg-white text-brand-900 px-5 py-2.5 rounded-xl font-bold hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all text-sm backdrop-blur-md"
            >
              <Plus size={18} />
              New Project
            </button>

            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-brand-900 border border-white/20 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-md"
              title="Refresh projects"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[250px] flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-300 transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            className="outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Search projects by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="md:w-auto w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 transition-all cursor-pointer appearance-none"
        >
          <option value="">All Statuses</option>
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="OnHold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="md:w-auto w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 transition-all cursor-pointer appearance-none"
        >
          <option value="">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* PROJECT GRID */}
      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
          <p className="font-medium text-lg">Loading projects...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <FolderKanban size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 max-w-sm">
            {search || statusFilter || priorityFilter ? "Try adjusting your filters to see more results." : "Get started by creating your first project for this workspace."}
          </p>
          {!(search || statusFilter || priorityFilter) && (
            <button
              onClick={() => setOpenModal(true)}
              className="mt-6 flex items-center gap-2 bg-brand-50 text-brand-700 px-5 py-2.5 rounded-xl font-bold hover:bg-brand-100 transition-all text-sm"
            >
              <Plus size={18} />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const ai = aiResults[p.id];

            return (
              <div
                key={p.id}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-3">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${statusStyle(p.status)} whitespace-nowrap`}>
                    {p.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{p.description}</p>

                {/* Priority & Lead */}
                <div className="flex justify-between items-center text-xs text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-5">
                  <span className="font-medium text-gray-700 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${p.priority === 'High' ? 'bg-red-500' : p.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                    {p.priority || "Low"}
                  </span>

                  {p.projectLeadId && (
                    <span className="font-medium flex items-center gap-1.5 text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      <UserCircle2 size={14} className="text-brand-500" />
                      <span className="truncate max-w-[100px]">{employees.find(emp => emp.id === p.projectLeadId)?.name || "Unknown Lead"}</span>
                    </span>
                  )}
                </div>

                {/* AI Risk & Progress */}
                <div className="space-y-4 mb-6">
                  {ai ? (
                    <div
                      className={`border px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${riskStyle(
                        ai.risk
                      )}`}
                    >
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <Bot size={14} />
                        Risk: {ai.risk}
                      </div>
                      <span className="font-semibold px-2 py-0.5 bg-white/50 rounded-md">
                        {(ai.confidence * 100).toFixed(1)}% Match
                      </span>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 px-3 py-2.5 rounded-xl text-xs flex items-center justify-between text-gray-400 bg-gray-50">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Bot size={14} />
                        Analyzing Risk...
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                      <span className="text-gray-600">Completion</span>
                      <span className="text-brand-600">{p.progressPercent || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner p-0.5">
                      <div
                        className="bg-gradient-to-r from-brand-400 to-brand-600 h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${Math.max(5, p.progressPercent || 0)}%` }} // Force small width to show gradient
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                  <button
                    onClick={() =>
                      navigate(`/admin/projects/${p.id}/board`)
                    }
                    className="flex-1 bg-gray-900 hover:bg-black text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 group/btn shadow-md shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20"
                  >
                    <FolderKanban size={16} className="text-gray-400 group-hover/btn:text-brand-400 transition-colors" />
                    Open Board
                    <ArrowRight size={16} className="opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                  </button>

                  <button
                    onClick={() => deleteProject(p.id)}
                    className="bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 px-4 rounded-xl transition-all"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROJECT MODAL */}
      {openModal && (
        <ProjectModal
          open={openModal}
          employees={employees}
          onClose={() => setOpenModal(false)}
          onCreated={() => {
            setOpenModal(false);
            fetchProjects();
          }}
        />
      )}
    </Layout>
  );
}
