import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { workspaceApi } from "../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  Users,
  ListTodo,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

export default function Analytics() {
  const [workspaceId, setWorkspaceId] = useState(
    localStorage.getItem("workspaceId")
  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleWorkspaceChange = () => {
      setWorkspaceId(localStorage.getItem("workspaceId"));
    };
    window.addEventListener("workspaceChanged", handleWorkspaceChange);
    return () =>
      window.removeEventListener("workspaceChanged", handleWorkspaceChange);
  }, []);

  const fetchAnalytics = async () => {
    try {
      if (!workspaceId) return;
      setLoading(true);
      const res = await workspaceApi.getAdminAnalytics();
      setStats(res.data);
    } catch (err) {
      console.log("Analytics Error:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      fetchAnalytics();
    }
  }, [workspaceId]);

  const safe = (n) => (typeof n === "number" ? n : 0);

  const totalTasks = safe(stats?.totalTasks);
  const doneTasks = safe(stats?.doneTasks);
  const pendingTasks = safe(stats?.pendingTasks);
  const inProgressTasks = safe(stats?.inProgressTasks);

  const totalLeaves = safe(stats?.totalLeaves);
  const approvedLeaves = safe(stats?.approvedLeaves);
  const rejectedLeaves = safe(stats?.rejectedLeaves);

  const taskCompletionRate = useMemo(() => {
    if (!totalTasks) return 0;
    return Math.round((doneTasks / totalTasks) * 100);
  }, [totalTasks, doneTasks]);

  const leaveRejectionRate = useMemo(() => {
    if (!totalLeaves) return 0;
    return Math.round((rejectedLeaves / totalLeaves) * 100);
  }, [totalLeaves, rejectedLeaves]);

  const taskData = [
    { name: "Pending", value: pendingTasks, fill: "url(#colorPending)", color: "#f59e0b" }, // Amber
    { name: "In Progress", value: inProgressTasks, fill: "url(#colorInProgress)", color: "#3b82f6" }, // Blue
    { name: "Done", value: doneTasks, fill: "url(#colorDone)", color: "#10b981" }, // Emerald 
  ];

  const leaveData = [
    { name: "Approved", value: approvedLeaves, fill: "url(#colorApproved)", color: "#14b8a6" },
    { name: "Rejected", value: rejectedLeaves, fill: "url(#colorRejected)", color: "#f43f5e" },
  ];

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xl p-5 border border-gray-100 shadow-2xl rounded-2xl flex flex-col gap-1.5 min-w-[150px] transform transition-all scale-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: data.color || payload[0].fill }}></div>
            <p className="text-gray-500 font-bold uppercase tracking-wider text-[11px]">{label || data.name}</p>
          </div>
          <p className="text-gray-900 font-black text-3xl flex items-baseline gap-1.5 pl-5">
            {payload[0].value}
            <span className="text-xs font-semibold text-gray-400">Total</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (!workspaceId) {
    return (
      <Layout>
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <BarChart3 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Workspace Selected</h3>
          <p className="text-gray-500 max-w-sm">
            Please select a workspace from the dashboard to view analytics and performance insights.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* PREMIUM HEADER - Matched with Admin Dashboard style */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner">
              <Activity className="text-teal-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Analytics Overview
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md">
              Real-time performance insights and metrics for your workspace.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-brand-900 border border-white/20 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-md"
            title="Refresh analytics data"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
          <p className="font-medium text-lg">Loading visual analytics...</p>
        </div>
      ) : !stats ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
            <Activity size={32} className="text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load analytics</h3>
          <p className="text-gray-500 max-w-sm">
            There was an error communicating with the server. Please try refreshing the data.
          </p>
        </div>
      ) : (
        <>
          {/* KPI Cards - Glassmorphic design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            <StatCard title="Team Members" value={safe(stats.totalEmployees)} icon={Users} color="from-brand-500 to-brand-600" />
            <StatCard title="Total Tasks" value={totalTasks} icon={ListTodo} color="from-indigo-500 to-indigo-600" />
            <StatCard title="Leave Requests" value={totalLeaves} icon={CalendarDays} color="from-purple-500 to-purple-600" />
            <RateCard title="Task Completion" percent={taskCompletionRate} icon={TrendingUp} color="from-teal-500 to-teal-600" />
            <RateCard title="Leave Rejection" percent={leaveRejectionRate} icon={TrendingDown} color="from-rose-500 to-rose-600" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Status Breakdown Chart */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:bg-indigo-100 transition-colors"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Task Status Breakdown</h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Distribution of all workspace tasks</p>
                </div>
              </div>

              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#fcd34d" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.6 }} />
                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                      barSize={48}
                      animationDuration={1500}
                    >
                      {taskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-sm hover:opacity-80 transition-opacity" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Summary Pie Chart */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full -z-10 group-hover:bg-teal-100 transition-colors"></div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                  <PieChartIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Leave Summary</h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Approved vs Rejected leaves</p>
                </div>
              </div>

              {totalLeaves === 0 ? (
                <div className="w-full h-[320px] flex flex-col items-center justify-center text-gray-400">
                  <PieChartIcon size={48} className="mb-4 opacity-50" />
                  <p className="font-medium text-sm">No leave data available</p>
                </div>
              ) : (
                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#0f766e" stopOpacity={0.9} />
                        </linearGradient>
                        <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#be123c" stopOpacity={0.9} />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={leaveData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={115}
                        paddingAngle={8}
                        animationDuration={1500}
                        stroke="none"
                        cornerRadius={8}
                      >
                        {leaveData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} className="drop-shadow-md hover:opacity-80 transition-opacity outline-none" style={{ outline: 'none' }} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => <span className="text-sm font-bold text-gray-700 ml-1.5">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className={`p-6 rounded-[1.5rem] text-white bg-gradient-to-br ${color} shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
      <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
        <Icon size={120} />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{title}</p>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-inner">
            <Icon size={18} />
          </div>
        </div>
        <h3 className="text-4xl font-black tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

function RateCard({ title, percent, icon: Icon, color }) {
  const safePercent = Math.min(100, Math.max(0, percent || 0));
  return (
    <div className={`p-6 rounded-[1.5rem] text-white bg-gradient-to-br ${color} shadow-lg shadow-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
      <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
        <Icon size={120} />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{title}</p>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shadow-inner">
            <Icon size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <h3 className="text-4xl font-black tracking-tight">{safePercent}</h3>
          <span className="text-xl font-bold text-white/80">%</span>
        </div>
      </div>
    </div>
  );
}
