import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api/api";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Activity,
  Bell,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function EmployeeDashboard() {
  const employeeId = localStorage.getItem("employeeId");
  const [workspaceId, setWorkspaceId] = useState(localStorage.getItem("workspaceId")); // ✅ dynamic
  const name = localStorage.getItem("name") || "Employee";

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);

  // ✅ Fetch all workspaces for this employee
  const fetchWorkspaces = async () => {
    try {
      if (!employeeId) return;
      const res = await api.get(`/api/workspaces/employee/${employeeId}`);
      setWorkspaces(res.data || []);
    } catch (err) {
      console.error("Failed to load workspaces", err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      if (!workspaceId || !employeeId) {
        setAnalytics(null);
        return;
      }

      const res = await api.get(
        `/api/workspaces/${workspaceId}/analytics/employee/${employeeId}`
      );

      setAnalytics(res.data);
    } catch (err) {
      console.log("Employee analytics error", err);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [employeeId]);

  useEffect(() => {
    fetchAnalytics();
  }, [workspaceId, employeeId]);

  const workloadLabel = useMemo(() => {
    if (!analytics) return "Normal";
    const score = analytics.workloadScore || 0;
    if (score >= 70) return "Heavy";
    if (score >= 40) return "Medium";
    return "Light";
  }, [analytics]);

  const workloadColor = useMemo(() => {
    if (!analytics) return "bg-gray-200";
    const score = analytics.workloadScore || 0;
    if (score >= 70) return "bg-red-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-teal-500";
  }, [analytics]);

  const workloadGradient = useMemo(() => {
    if (!analytics) return "from-gray-200 to-gray-300";
    const score = analytics.workloadScore || 0;
    if (score >= 70) return "from-red-500 to-rose-600 shadow-red-500/50";
    if (score >= 40) return "from-orange-400 to-orange-500 shadow-orange-500/50";
    return "from-teal-400 to-teal-500 shadow-teal-500/50";
  }, [analytics]);

  const safe = (n) => (typeof n === "number" ? n : 0);

  return (
    <Layout>
      {/* Premium Header Profile Section */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 text-white shadow-xl relative overflow-hidden group">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 flex-wrap">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold shadow-2xl relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-brand-200 font-medium mb-1 tracking-wide uppercase text-sm flex items-center gap-2">
                Welcome Back <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
              </p>
              <h2 className="text-4xl font-bold tracking-tight mb-2">
                {name}
              </h2>
              <p className="text-brand-100/80 text-sm max-w-md leading-relaxed">
                Track your tasks, manage leaves, and review your daily workload to stay productive.
              </p>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex flex-col gap-3 items-start lg:items-end w-full lg:w-auto">
            {/* Workspace Selector */}
            {workspaces.length > 0 && (
              <div className="relative group/select w-full lg:w-64">
                <select
                  value={workspaceId || ""}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setWorkspaceId(selectedId);
                    localStorage.setItem("workspaceId", selectedId);
                  }}
                  className="w-full appearance-none bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium backdrop-blur-md outline-none transition-all cursor-pointer shadow-lg"
                >
                  <option value="" className="text-gray-900">Select Workspace</option>
                  {workspaces.map((ws) => (
                    <option key={ws._id} value={ws._id} className="text-gray-900">
                      🏢 {ws.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-200 group-hover/select:text-white transition-colors">
                  <Layers size={16} />
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 w-full">
              <Link
                to="/employee-tasks"
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white text-brand-900 px-4 py-2.5 rounded-xl hover:bg-brand-50 hover:scale-105 transition-all text-sm font-bold shadow-lg shadow-white/10"
              >
                <ListTodo size={16} />
                My Tasks
              </Link>

              <Link
                to="/employee-leaves"
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-brand-600/50 hover:bg-brand-500/80 border border-brand-400/30 text-white px-4 py-2.5 rounded-xl transition-all text-sm font-semibold backdrop-blur-md"
              >
                <Calendar size={16} />
                Apply Leave
              </Link>

              <Link
                to="/employee-notifications"
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2.5 rounded-xl transition-all text-sm font-semibold backdrop-blur-md"
              >
                <Bell size={16} />
                <span className="lg:hidden">Alerts</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
          <p className="font-medium text-lg">Loading your dashboard...</p>
        </div>
      ) : !analytics ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-red-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
            <Activity size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Unavailable</h3>
          <p className="text-gray-500 max-w-sm mb-6">
            We couldn't load your dashboard data right now. Please select a workspace or try again.
          </p>
          <button
            onClick={fetchAnalytics}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-xl hover:bg-brand-700 transition font-semibold shadow-lg shadow-brand-500/30"
          >
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Assigned"
              value={safe(analytics.totalTasks)}
              icon={Layers}
              color="text-brand-600"
              bgColor="bg-brand-50"
              borderColor="border-brand-100"
            />
            <StatCard
              title="Pending Tasks"
              value={safe(analytics.pendingTasks)}
              icon={Clock}
              color="text-orange-600"
              bgColor="bg-orange-50"
              borderColor="border-orange-100"
            />
            <StatCard
              title="In Progress"
              value={safe(analytics.inProgressTasks)}
              icon={Activity}
              color="text-blue-600"
              bgColor="bg-blue-50"
              borderColor="border-blue-100"
            />
            <StatCard
              title="Completed"
              value={safe(analytics.doneTasks)}
              icon={CheckCircle2}
              color="text-teal-600"
              bgColor="bg-teal-50"
              borderColor="border-teal-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Workload Indicator */}
            <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>

              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={18} className="text-gray-400" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Workload Analysis
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Real-time score based on your pending & in-progress tasks
                  </p>
                </div>

                <div className={`px-4 py-1.5 rounded-full border text-sm font-bold shadow-sm ${workloadLabel === 'Heavy' ? 'bg-red-50 text-red-700 border-red-200' :
                  workloadLabel === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-teal-50 text-teal-700 border-teal-200'
                  }`}
                >
                  {workloadLabel} Capacity
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <span className="text-5xl font-black text-gray-900 tracking-tighter">
                  {safe(analytics.workloadScore)}<span className="text-2xl text-gray-400 font-medium tracking-normal">/100</span>
                </span>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner p-0.5 relative">
                <div
                  className={`bg-gradient-to-r ${workloadGradient} h-full rounded-full transition-all duration-1000 ease-out relative shadow-lg`}
                  style={{
                    width: `${Math.min(100, Math.max(5, safe(analytics.workloadScore)))}%`, // Minimum 5% to show styling
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full custom-stripes"></div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-medium text-gray-400 mt-3 px-1">
                <span>Light (0-39)</span>
                <span>Medium (40-69)</span>
                <span>Heavy (70+)</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-brand-50 to-white border border-brand-100 shadow-sm rounded-[2rem] p-8 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Need a break?</h3>
              <p className="text-sm text-gray-500 mb-6">Manage your time off and view leave status.</p>

              <div className="flex-1 flex flex-col justify-center space-y-4">
                <Link to="/employee-leaves" className="group flex items-center justify-between p-4 bg-white border border-brand-100 rounded-2xl hover:border-brand-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">Apply for Leave</h4>
                      <p className="text-xs text-gray-500">Submit a new request</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
                    <span className="block text-2xl font-black text-teal-600 mb-1">{safe(analytics.approvedLeaves)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Approved</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center">
                    <span className="block text-2xl font-black text-gray-900 mb-1">{safe(analytics.totalLeaves)}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Req</span>
                  </div>
                </div>
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

/* Small reusable components */

function StatCard({ title, value, icon: Icon, color, bgColor, borderColor }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-[1.5rem] p-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${bgColor} ${borderColor} border transition-colors group-hover:scale-110 duration-300`}>
          <Icon size={22} className={color} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
}

