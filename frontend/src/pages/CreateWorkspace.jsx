import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { FolderKanban, FileText, Loader2, Plus, Sparkles } from "lucide-react";

export default function CreateWorkspace() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Workspace name is required to proceed.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/workspaces/create", {
        name,
        description,
      });
      navigate("/admin/employees", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#0a0f1c] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBMMDQwIE0wIDBMNDAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIC8+Cjwvc3ZnPg==')] opacity-40"></div>

      <div className="w-full max-w-lg relative z-10 glass-dark rounded-[2.5rem] p-10 border border-white/10 shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-brand-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
            <FolderKanban className="text-white relative z-10" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            Setup Workspace
          </h2>
          <p className="text-gray-400 text-sm">
            Create a collaborative environment to organize your teams and projects.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-[1rem] bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
            <span className="shrink-0 mt-0.5 relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Workspace Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="e.g. Acme Corp Engineering"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-[1rem] pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner font-medium placeholder:text-gray-600 focus:bg-gray-800/50"
                />
                <FolderKanban size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Description (Optional)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="What is this workspace for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-900/50 border border-gray-700/50 text-white rounded-[1rem] pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-inner font-medium placeholder:text-gray-600 focus:bg-gray-800/50"
                />
                <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-400 transition-colors" />
              </div>
            </div>
          </div>

          <button
            disabled={loading || !name.trim()}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-brand-600 to-indigo-600 text-white py-4 rounded-[1rem] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-500/25 mt-2"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <div className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Workspace...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                  Launch Workspace
                </>
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
