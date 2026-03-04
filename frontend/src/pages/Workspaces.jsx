import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { Plus, Trash2, ArrowRight, Building2, CheckCircle2, Search, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const activeWorkspaceId = localStorage.getItem("workspaceId");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ FIXED FETCH
  const fetchWorkspaces = async () => {
    try {
      if (!user?.userId) return;

      setLoading(true);

      const res = await api.get(`/api/workspaces/owner/${user.userId}`);

      setWorkspaces(res.data || []);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // ✅ FIXED CREATE
  const createWorkspace = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim())
      return alert("Fill all fields");

    try {
      if (!user?.userId) {
        alert("Login again");
        return;
      }

      await api.post(`/api/workspaces/owner/${user.userId}`,
        {
          name: name.trim(),
          description: description.trim(),
        }
      );

      setName("");
      setDescription("");
      fetchWorkspaces();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to create workspace");
    }
  };

  // ✅ FIXED DELETE
  const deleteWorkspace = async (id) => {
    const ok = confirm("Are you sure you want to delete this workspace? This action cannot be undone.");
    if (!ok) return;

    try {
      if (!user?.userId) return;

      await api.delete(`/api/workspaces/owner/${user.userId}/${id}`);

      if (activeWorkspaceId === id) {
        localStorage.removeItem("workspaceId");
        localStorage.removeItem("workspaceName");
      }

      fetchWorkspaces();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to delete workspace");
    }
  };

  const openWorkspace = (w) => {
    localStorage.setItem("workspaceId", w.id);
    localStorage.setItem("workspaceName", w.name);
    // Trigger custom event to notify components that workspace changed
    window.dispatchEvent(new Event("workspaceChanged"));
    navigate("/");
  };

  const filteredWorkspaces = workspaces.filter(w =>
    w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* PREMIUM HEADER - Matched with Admin Dashboard style */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner">
              <Building2 className="text-indigo-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Workspaces
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md">
              Manage your organizations and projects from one central hub.
            </p>
          </div>

          <div className="relative w-full md:w-72 mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-200" />
            </div>
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-200 rounded-[1.25rem] pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all backdrop-blur-md shadow-inner text-sm font-medium"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CREATE WORKSPACE SECTION */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-6 lg:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Plus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Create New Workspace</h3>
            <p className="text-xs font-medium text-gray-500 mt-0.5">Set up a new organization or department</p>
          </div>
        </div>

        <form
          onSubmit={createWorkspace}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1">
            <input
              className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Workspace Name (e.g., Engineering Team)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex-[2]">
            <input
              className="w-full border border-gray-200 rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Brief description of this workspace's purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl px-6 py-3.5 hover:from-brand-700 hover:to-indigo-700 transition-all font-bold shadow-md shadow-indigo-500/20 border border-transparent disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed shrink-0"
          >
            <Plus size={18} strokeWidth={2.5} /> Create
          </button>
        </form>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Briefcase size={20} className="text-brand-500" /> Your Workspaces
        </h3>
        <span className="text-sm font-bold bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full border border-brand-100">
          {filteredWorkspaces.length} Total
        </span>
      </div>

      {/* WORKSPACE LIST */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-pulse h-[220px]">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-auto"></div>
              <div className="mt-12 flex gap-3">
                <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
                <div className="h-10 w-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 border border-brand-100 shadow-inner">
            <Building2 size={40} className="text-brand-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Workspaces Yet</h3>
          <p className="text-gray-500 max-w-md">
            Create your first workspace above to start managing projects, employees, and tasks.
          </p>
        </div>
      ) : filteredWorkspaces.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
            <Search size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any workspaces matching "{searchQuery}". Try adjusting your search.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 px-6 py-2.5 bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 font-bold rounded-xl transition-colors border border-brand-200"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map((w) => {
            const isActive = activeWorkspaceId === w.id;

            // Generate deterministic colors based on workspace name
            const colorThemes = [
              { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600", gradient: "from-indigo-500 to-indigo-600" },
              { bg: "bg-brand-50", border: "border-brand-100", text: "text-brand-600", gradient: "from-brand-500 to-teal-500" },
              { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-600", gradient: "from-purple-500 to-pink-500" },
              { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-600" },
              { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600", gradient: "from-rose-500 to-orange-500" }
            ];
            const nameLen = w.name?.length || 0;
            const theme = colorThemes[nameLen % colorThemes.length];

            return (
              <div
                key={w.id}
                className={`group relative flex flex-col rounded-[2rem] p-6 transition-all duration-300 ${isActive
                    ? "bg-white border-2 border-brand-500 shadow-md transform -translate-y-1"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-300"
                  }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-brand-500 rounded-b-md"></div>
                )}

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold leading-tight ${isActive ? 'text-brand-700' : 'text-gray-900 group-hover:text-brand-600 transition-colors'}`}>
                      {w.name}
                    </h3>

                    {isActive && (
                      <span className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-600 border border-brand-200">
                        <CheckCircle2 size={10} strokeWidth={3} /> Active Workspace
                      </span>
                    )}
                  </div>

                  <div className={`shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border ${theme.bg} ${theme.border} ${theme.text}`}>
                    {w.name?.[0]?.toUpperCase() || "W"}
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {w.description || "No description provided."}
                </p>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => openWorkspace(w)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all shadow-sm ${isActive
                        ? "bg-gray-100 text-gray-500 cursor-default shadow-none border border-transparent"
                        : "bg-white hover:bg-brand-50 text-brand-600 border border-brand-200 hover:border-brand-300 hover:text-brand-700"
                      }`}
                    disabled={isActive}
                  >
                    {isActive ? "Currently Active" : <>Open Workspace <ArrowRight size={16} /></>}
                  </button>

                  <button
                    onClick={() => deleteWorkspace(w.id)}
                    className="flex shrink-0 items-center justify-center p-2.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 hover:border-red-300 rounded-xl transition-all shadow-sm hover:shadow-md"
                    title="Delete workspace"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}