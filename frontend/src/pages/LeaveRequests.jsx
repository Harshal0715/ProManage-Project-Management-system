import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { workspaceApi } from "../api/api";
import { useWorkspace } from "../context/WorkspaceContext";

import {
  Search,
  Filter,
  RefreshCcw,
  Check,
  X,
  CalendarDays,
  User,
  Briefcase,
  Building2,
  Clock,
  Layers,
  Info
} from "lucide-react";

export default function LeaveRequests() {
  const { workspaceId, workspaceName } = useWorkspace();

  const [leaves, setLeaves] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return date;
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return "-";
    const diff =
      new Date(end).getTime() - new Date(start).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  // ==============================
  // FETCH DATA
  // ==============================
  const fetchData = async () => {
    try {
      if (!workspaceId) {
        setLeaves([]);
        return;
      }

      setLoading(true);

      const [leaveRes, empRes] = await Promise.all([
        workspaceApi.getLeaves(),
        workspaceApi.getEmployees(),
      ]);

      const leaveList = leaveRes.data || [];
      const empList = empRes.data || [];

      const empMap = {};
      empList.forEach((e) => {
        empMap[e.id] = e; // store full employee object
      });

      setEmployeesMap(empMap);
      setLeaves(leaveList);
    } catch (err) {
      console.log("Leave load error:", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [workspaceId]);

  // ==============================
  // UPDATE STATUS
  // ==============================
  const updateLeaveStatus = async (leaveId, status) => {
    try {
      await fetch(
        `http://localhost:8081/api/workspaces/${workspaceId}/leaves/${leaveId}/status?status=${status}`,
        { method: "PUT" }
      );
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const badgeColor = (status) => {
    if (status === "Approved")
      return "bg-teal-50 text-teal-700 border-teal-200 shadow-sm shadow-teal-500/10";
    if (status === "Rejected")
      return "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-500/10";
    return "bg-orange-50 text-orange-700 border-orange-200 shadow-sm shadow-orange-500/10";
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((l) => {
      const employee = employeesMap[l.employeeId];
      const name = employee?.name || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        l.reason?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || l.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leaves, search, statusFilter, employeesMap]);

  if (!workspaceId) {
    return (
      <Layout>
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <Layers size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Workspace Selected</h3>
          <p className="text-gray-500 max-w-sm">
            Please create or select a workspace from the sidebar to manage leave requests.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* PREMIUM HEADER */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-teal-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner">
              <CalendarDays className="text-teal-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Leave Management
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md flex items-center gap-1.5">
              <Briefcase size={14} className="text-teal-400" />
              Workspace: {workspaceName}
            </p>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-brand-900 border border-white/20 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-md"
            title="Refresh requests"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[250px] flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-300 transition-all">
          <Search size={18} className="text-gray-400" />
          <input
            className="outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal bg-transparent"
            placeholder="Search by employee name or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="w-full md:w-auto pl-11 pr-10 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 bg-white shadow-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 transition-all cursor-pointer appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* CARDS */}
      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
          <p className="font-medium text-lg">Loading leave requests...</p>
        </div>
      ) : filteredLeaves.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 border border-brand-100">
            <CalendarDays size={32} className="text-brand-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No leave requests found</h3>
          <p className="text-gray-500 max-w-sm">
            {search || statusFilter ? "Try adjusting your search or filters to see more results." : "There are currently no leave requests in this workspace."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaves.map((leave) => {
            const employee = employeesMap[leave.employeeId];

            return (
              <div
                key={leave.id}
                className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Employee Info Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-teal-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-lg shadow-inner">
                      {employee?.name ? employee.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
                        {employee?.name || "Unknown Employee"}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-gray-500">
                        <Briefcase size={12} className="text-brand-400" />
                        {employee?.role || "Staff"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold border ${badgeColor(
                      leave.status
                    )}`}
                  >
                    {leave.status}
                  </span>
                </div>

                {/* Leave Details Box */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm space-y-3 mb-6 flex-1">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Duration</span>
                      <span className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Clock size={14} className="text-brand-500" />
                        {calculateDays(leave.fromDate, leave.toDate)} Days
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Applied On</span>
                      <span className="text-gray-600 font-medium">{formatDate(leave.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Start Date</span>
                      <span className="font-medium">{formatDate(leave.fromDate)}</span>
                    </div>
                    <div className="w-8 border-t-2 border-dashed border-gray-300"></div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">End Date</span>
                      <span className="font-medium">{formatDate(leave.toDate)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200/60">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1 mb-1">
                      <Info size={12} /> Reason for Leave
                    </span>
                    <p className="text-gray-700 italic text-sm leading-relaxed bg-white p-2.5 rounded-xl border border-gray-100">
                      "{leave.reason}"
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                {leave.status === "Pending" ? (
                  <div className="flex gap-3 mt-auto pt-2">
                    <button
                      onClick={() => updateLeaveStatus(leave.id, "Approved")}
                      className="flex-1 bg-teal-50 hover:bg-teal-500 hover:text-white text-teal-700 border border-teal-200 hover:border-teal-500 py-2.5 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md hover:shadow-teal-500/20"
                    >
                      <Check size={16} strokeWidth={3} />
                      Approve
                    </button>

                    <button
                      onClick={() => updateLeaveStatus(leave.id, "Rejected")}
                      className="flex-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-700 border border-red-200 hover:border-red-500 py-2.5 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md hover:shadow-red-500/20"
                    >
                      <X size={16} strokeWidth={3} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="mt-auto pt-2 flex items-center justify-center py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-500">
                    Request resolved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}