import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { workspaceApi } from "../api/api";
import { useWorkspace } from "../context/WorkspaceContext";

import {
  Users,
  ListTodo,
  CalendarDays,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCcw,
  FolderKanban,
  TrendingUp,
  Briefcase,
  AlertCircle,
  Layers
} from "lucide-react";

export default function Dashboard() {
  const { workspaceId, workspaceName, role } = useWorkspace();

  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      if (!workspaceId) {
        setAdminStats(null);
        return;
      }
      setLoading(true);
      const res = await workspaceApi.getAdminAnalytics();
      setAdminStats(res.data);
    } catch (err) {
      console.log("Dashboard load failed:", err);
      setAdminStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, [workspaceId]);

  const completionRate = useMemo(() => {
    if (!adminStats || adminStats.totalTasks === 0) return 0;
    return Math.round((adminStats.doneTasks / adminStats.totalTasks) * 100);
  }, [adminStats]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Layout>
      {/* PREMIUM WELCOME HEADER */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/20">
              <Activity size={32} className="text-teal-300" />
            </div>
            <div>
              <p className="text-brand-200 font-medium mb-1 tracking-wide uppercase text-sm flex items-center gap-2">
                Overview <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Welcome, {role || "Admin"}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-brand-100/90 text-sm">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full"><Briefcase size={14} className="text-teal-400" /> {workspaceName || "Select a Workspace"}</span>
                <span className="hidden sm:inline-block">•</span>
                <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {today}</span>
              </div>
            </div>
          </div>

          <button
            onClick={fetchAdminStats}
            className="w-fit flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-brand-900 border border-white/20 whitespace-nowrap px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-md"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* STATES */}
      {loading ? (
        <StateCard message="Analyzing workspace data..." loading={true} />
      ) : !workspaceId ? (
        <StateCard
          message="No Workspace Selected"
          sub="Please select or create a workspace from the sidebar to view analytics."
          icon={Layers}
        />
      ) : !adminStats ? (
        <StateCard
          message="Analytics Unavailable"
          sub="We couldn't retrieve the dashboard data. Please try again."
          error
          retry={fetchAdminStats}
          icon={AlertCircle}
        />
      ) : (
        <div className="space-y-8 animate-fade-in">

          {/* PROGRESS SUMMARY */}
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={20} className="text-brand-500" />
                  <h3 className="text-xl font-bold text-gray-900">Workspace Progress</h3>
                </div>
                <p className="text-sm text-gray-500">Overall task completion rate across all projects</p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">{completionRate}</span>
                <span className="text-xl text-gray-400 font-bold">%</span>
              </div>
            </div>

            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner relative p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative shadow-sm ${completionRate >= 70 ? 'bg-gradient-to-r from-teal-400 to-teal-500' :
                  completionRate >= 40 ? 'bg-gradient-to-r from-brand-400 to-brand-600' :
                    'bg-gradient-to-r from-orange-400 to-orange-500'
                  }`}
                style={{ width: `${Math.max(5, completionRate)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full custom-stripes"></div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className={`text-sm font-semibold ${completionRate >= 70 ? "text-teal-600" :
                completionRate >= 40 ? "text-brand-600" :
                  "text-orange-600"
                }`}>
                {completionRate >= 70 ? "🚀 Outstanding progress! Keep it up." :
                  completionRate >= 40 ? "📈 Good momentum. Let's close those tasks." :
                    "⚠️ Productivity needs a boost."}
              </p>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                {adminStats.doneTasks} of {adminStats.totalTasks} Tasks
              </span>
            </div>
          </div>

          {/* KPI CARDS */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 ml-2 flex items-center gap-2">
              <Activity size={18} className="text-gray-400" /> Metrics Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <StatCard title="Total Staff" value={adminStats.totalEmployees || 0} icon={Users} color="text-brand-600" bgColor="bg-brand-50" borderColor="border-brand-100" />
              <StatCard title="Total Layouts" value={adminStats.totalTasks || 0} icon={ListTodo} color="text-indigo-600" bgColor="bg-indigo-50" borderColor="border-indigo-100" />
              <StatCard title="Active Leaves" value={adminStats.totalLeaves || 0} icon={CalendarDays} color="text-orange-600" bgColor="bg-orange-50" borderColor="border-orange-100" />
              <StatCard title="To Do" value={adminStats.pendingTasks || 0} icon={Clock} color="text-gray-600" bgColor="bg-gray-100" borderColor="border-gray-200" />
              <StatCard title="In Progress" value={adminStats.inProgressTasks || 0} icon={TrendingUp} color="text-blue-600" bgColor="bg-blue-50" borderColor="border-blue-100" />
              <StatCard title="Completed" value={adminStats.doneTasks || 0} icon={CheckCircle2} color="text-teal-600" bgColor="bg-teal-50" borderColor="border-teal-100" />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2rem] border border-gray-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Workspace Management</h3>
                <p className="text-gray-400 text-sm">Quickly access key administrative functions</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <QuickBtn to="/admin/employees" icon={Users} label="Team" />
                <QuickBtn to="/admin/projects" icon={FolderKanban} label="Projects" />
                <QuickBtn to="/admin/tasks" icon={ListTodo} label="Tasks" />
                <QuickBtn to="/admin/leaves" icon={CalendarDays} label="Leaves" />
              </div>
            </div>
          </div>

        </div>
      )}

      <style>{`
        .custom-stripes {
          background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
          background-size: 1rem 1rem;
        }
      `}</style>
    </Layout>
  );
}

// ==============================
// COMPONENTS
// ==============================
function StatCard({ title, value, icon: Icon, color, bgColor, borderColor }) {
  return (
    <div className={`bg-white border ${borderColor} shadow-sm rounded-[1.5rem] p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${bgColor} ${color} border ${borderColor} transition-colors group-hover:scale-110 duration-300`}>
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
      <div>
        <h3 className="text-4xl font-black text-gray-900 tracking-tight">{value}</h3>
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 mt-2">{title}</p>
      </div>
    </div>
  );
}

function QuickBtn({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 bg-white/10 hover:bg-white text-gray-300 hover:text-gray-900 border border-white/10 px-5 py-3 rounded-xl hover:scale-105 hover:shadow-lg transition-all font-semibold text-sm backdrop-blur-md"
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function StateCard({ message, sub, error, retry, loading, icon: Icon }) {
  return (
    <div className="bg-white p-12 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
      {loading ? (
        <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-600 rounded-full animate-spin mb-6"></div>
      ) : Icon ? (
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${error ? "bg-red-50 border-red-100 text-red-500" : "bg-gray-50 border-gray-100 text-gray-400"}`}>
          <Icon size={32} />
        </div>
      ) : null}

      <h3 className={`text-xl font-bold mb-2 ${error ? "text-red-600" : "text-gray-900"}`}>
        {message}
      </h3>
      {sub && <p className="text-gray-500 max-w-sm">{sub}</p>}

      {retry && (
        <button
          onClick={retry}
          className="mt-8 bg-brand-600 text-white px-6 py-2.5 rounded-xl hover:bg-brand-700 transition font-semibold shadow-lg shadow-brand-500/30"
        >
          Retry
        </button>
      )}
    </div>
  );
}
