import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { CalendarDays, Link2, Save, LayoutDashboard, CheckCircle2, Clock, PlayCircle } from "lucide-react";

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState({});

  const employeeId = localStorage.getItem("employeeId");
  const workspaceId = localStorage.getItem("workspaceId");

  const fetchMyTasks = async () => {
    try {
      setLoading(true);

      if (!workspaceId || !employeeId) {
        setTasks([]);
        return;
      }

      const res = await api.get(
        `/api/workspaces/${workspaceId}/tasks/employee/${employeeId}`
      );

      setTasks(res.data || []);
    } catch (err) {
      console.log(err);
      alert("❌ Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [workspaceId, employeeId]);

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/status?status=${status}`
      );
      fetchMyTasks();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to update status");
    }
  };

  const handleChange = (taskId, field, value) => {
    setUpdates((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        [field]: value,
      },
    }));
  };

  const saveProgress = async (task) => {
    try {
      const payload = {
        progressNote: updates[task.id]?.progressNote || task.progressNote || "",
        proofLink: updates[task.id]?.proofLink || task.proofLink || "",
      };

      await api.put(
        `/api/workspaces/${workspaceId}/tasks/${task.id}/progress`,
        payload
      );

      alert("✅ Progress updated!");
      fetchMyTasks();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to save progress");
    }
  };

  // ✅ Normalize status for display
  const displayStatus = (s) => {
    switch (s) {
      case "Pending":
        return "To Do";
      case "InProgress":
        return "In Progress";
      case "Done":
        return "Completed";
      default:
        return s;
    }
  };

  const statusBadge = (s) => {
    if (s === "Done") return "bg-teal-50 text-teal-700 border-teal-200";
    if (s === "InProgress") return "bg-brand-50 text-brand-700 border-brand-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  // ✅ Split tasks by status
  const pendingTasks = tasks.filter((t) => t.status === "Pending");
  const inProgressTasks = tasks.filter((t) => t.status === "InProgress");
  const doneTasks = tasks.filter((t) => t.status === "Done");

  // ✅ Reusable task card
  const renderTask = (t) => (
    <div key={t.id} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 w-full overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors truncate">{t.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{t.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <span
          className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold border ${statusBadge(
            t.status
          )}`}
        >
          {displayStatus(t.status)}
        </span>
        <span
          className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold border ${t.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
              t.priority === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
            }`}
        >
          {t.priority || "Low"} Priority
        </span>
      </div>

      <div className="flex items-center text-xs text-gray-500 mb-6 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
        <span className="flex items-center gap-1.5 font-medium">
          <CalendarDays size={14} className="text-brand-500" />
          Due: <span className="text-gray-700">{t.dueDate || "Not set"}</span>
        </span>
      </div>

      <div className="flex gap-2 mt-4 bg-gray-50/50 p-1.5 rounded-xl border border-gray-100">
        <button
          disabled={t.status === "Pending"}
          onClick={() => updateStatus(t.id, "Pending")}
          className={`flex-1 px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${t.status === "Pending"
              ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 cursor-default"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
            }`}
        >
          <Clock size={14} className={t.status === "Pending" ? "text-gray-400" : ""} />
          To Do
        </button>

        <button
          disabled={t.status === "InProgress"}
          onClick={() => updateStatus(t.id, "InProgress")}
          className={`flex-1 px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${t.status === "InProgress"
              ? "bg-white text-brand-700 shadow-sm ring-1 ring-gray-200 cursor-default"
              : "text-gray-500 hover:text-brand-600 hover:bg-gray-100/50"
            }`}
        >
          <PlayCircle size={14} className={t.status === "InProgress" ? "text-brand-500" : ""} />
          Doing
        </button>

        <button
          disabled={t.status === "Done"}
          onClick={() => updateStatus(t.id, "Done")}
          className={`flex-1 px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${t.status === "Done"
              ? "bg-white text-teal-700 shadow-sm ring-1 ring-gray-200 cursor-default"
              : "text-gray-500 hover:text-teal-600 hover:bg-gray-100/50"
            }`}
        >
          <CheckCircle2 size={14} className={t.status === "Done" ? "text-teal-500" : ""} />
          Done
        </button>
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1.5">
          Progress Update
        </label>
        <textarea
          value={updates[t.id]?.progressNote ?? t.progressNote ?? ""}
          onChange={(e) => handleChange(t.id, "progressNote", e.target.value)}
          placeholder="What did you work on?"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm min-h-[80px] outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all resize-none placeholder:text-gray-400"
        />
      </div>

      <div className="mt-4">
        <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center gap-1.5">
          Proof Link <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Link2 size={16} className="text-gray-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            value={updates[t.id]?.proofLink ?? t.proofLink ?? ""}
            onChange={(e) => handleChange(t.id, "proofLink", e.target.value)}
            placeholder="https://..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <button
        onClick={() => saveProgress(t)}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-0.5 transition-all font-semibold outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        <Save size={18} />
        <span>Save Updates</span>
      </button>
    </div>
  );

  return (
    <Layout>
      {/* 🔥 Premium Header */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-screen"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10">
              <LayoutDashboard className="text-brand-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Update your progress, attach proof of work, and move tasks across the board.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
          <p className="font-medium text-lg">Loading your workstation...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <CheckCircle2 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h3>
          <p className="text-gray-500 max-w-sm">
            There are no tasks assigned to you right now. Take a breather or check with your lead.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              To Do
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{pendingTasks.length}</span>
            </h3>
            {pendingTasks.map(renderTask)}
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              In Progress
              <span className="text-xs font-semibold bg-brand-50 text-brand-600 px-2.5 py-1 rounded-full">{inProgressTasks.length}</span>
            </h3>
            {inProgressTasks.map(renderTask)}
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              Completed
              <span className="text-xs font-semibold bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full">{doneTasks.length}</span>
            </h3>
            {doneTasks.map(renderTask)}
          </div>
        </div>
      )}
    </Layout>
  );
}
