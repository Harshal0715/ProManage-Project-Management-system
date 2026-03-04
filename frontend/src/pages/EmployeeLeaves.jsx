import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { CalendarDays, Send, RefreshCcw, Layers, Info, Check, Clock, XCircle, ChevronRight, Activity } from "lucide-react";

export default function EmployeeLeaves() {
  const employeeId = localStorage.getItem("employeeId");
  const workspaceId = localStorage.getItem("workspaceId"); // ✅ FIX

  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);

      if (!workspaceId || !employeeId) {
        setLeaves([]);
        return;
      }

      // ✅ FIXED API
      const res = await api.get(
        `/api/workspaces/${workspaceId}/leaves/employee/${employeeId}`
      );

      // Sort leaves by latest first
      const sortedLeaves = (res.data || []).sort((a, b) => new Date(b.createdAt || b.fromDate) - new Date(a.createdAt || a.fromDate));
      setLeaves(sortedLeaves);
    } catch (err) {
      console.log(err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [workspaceId, employeeId]); // ✅ reload if workspace changes

  const badgeConfig = (status) => {
    switch (status) {
      case "Approved":
        return { color: "bg-teal-50 text-teal-700 border-teal-200 shadow-teal-500/10", icon: Check };
      case "Rejected":
        return { color: "bg-red-50 text-red-700 border-red-200 shadow-red-500/10", icon: XCircle };
      default:
        return { color: "bg-orange-50 text-orange-700 border-orange-200 shadow-orange-500/10", icon: Clock };
    }
  };

  const validDates = useMemo(() => {
    if (!fromDate || !toDate) return true;
    return new Date(toDate) >= new Date(fromDate);
  }, [fromDate, toDate]);

  const calculateDays = (start, end) => {
    if (!start || !end) return "-";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  const applyLeave = async (e) => {
    e.preventDefault();

    if (!reason || !fromDate || !toDate) {
      alert("❌ Please fill all fields");
      return;
    }

    if (!validDates) {
      alert("❌ To Date must be same or after From Date");
      return;
    }

    try {
      setApplying(true);

      if (!workspaceId) {
        alert("No workspace selected");
        return;
      }

      // ✅ FIXED API
      await api.post(
        `/api/workspaces/${workspaceId}/leaves`,
        {
          employeeId,
          reason,
          fromDate,
          toDate,
        }
      );

      setReason("");
      setFromDate("");
      setToDate("");

      fetchMyLeaves();
    } catch (err) {
      console.log(err);
      alert("❌ Failed to apply leave");
    } finally {
      setApplying(false);
    }
  };

  if (!workspaceId) {
    return (
      <Layout>
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <Layers size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Workspace Selected</h3>
          <p className="text-gray-500 max-w-sm">
            Please select a workspace from the dashboard to view and manage your leaves.
          </p>
        </div>
      </Layout>
    );
  }

  // Calculate summaries
  const pendingCount = leaves.filter(l => l.status === "Pending").length;
  const approvedCount = leaves.filter(l => l.status === "Approved").length;

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
              My Leave Requests
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md">
              Apply for time off and track your approval status in real-time.
            </p>
          </div>

          <button
            onClick={fetchMyLeaves}
            className="flex items-center gap-2 bg-white/10 hover:bg-white text-white hover:text-brand-900 border border-white/20 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-md"
            title="Refresh leave history"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEAVE FORM */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -z-10"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-brand-600">
                <Send size={18} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                New Leave Request
              </h3>
            </div>

            <form onSubmit={applyLeave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
                  Reason for leave
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-3.5 text-gray-400">
                    <Info size={16} />
                  </div>
                  <input
                    className="w-full border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Medical, Personal, etc."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all text-sm font-medium text-gray-700 cursor-pointer"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className={`w-full border rounded-xl p-3 outline-none transition-all text-sm font-medium text-gray-700 cursor-pointer ${validDates
                        ? "border-gray-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                        : "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-400 bg-red-50"
                      }`}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </div>

              {!validDates && (
                <p className="text-xs font-medium border border-red-200 bg-red-50 text-red-600 p-2 rounded-lg flex items-center gap-1.5 animate-pulse">
                  <XCircle size={14} /> End date must be after start date
                </p>
              )}

              {fromDate && toDate && validDates && (
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-center justify-between text-sm">
                  <span className="text-brand-700 font-medium">Requested Duration:</span>
                  <span className="font-bold text-brand-900 bg-white px-2 py-1 rounded-md shadow-sm border border-brand-100">{calculateDays(fromDate, toDate)} Days</span>
                </div>
              )}

              <button
                type="submit"
                disabled={applying || !validDates || !reason || !fromDate || !toDate}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-teal-600 text-white px-4 py-3.5 rounded-xl hover:from-brand-700 hover:to-teal-700 transition-all font-bold shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed group mt-2"
              >
                {applying ? (
                  <>
                    <Activity size={18} className="animate-pulse" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Leave Request
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Stats Summary */}
          {!loading && leaves.length > 0 && (
            <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 ml-1">Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-orange-600 mb-1">{pendingCount}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700/70">Pending</span>
                </div>
                <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-teal-600 mb-1">{approvedCount}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700/70">Approved</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LEAVE HISTORY */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-6 md:p-8 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity size={20} className="text-gray-400" />
                Leave History
              </h3>
              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full border border-gray-200">
                {leaves.length} Total Requests
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
                <p className="font-medium">Loading your leave history...</p>
              </div>
            ) : leaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                  <CalendarDays size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-900 font-bold text-lg mb-1">
                  No Leave History
                </p>
                <p className="text-sm text-gray-500 max-w-sm">
                  You haven't submitted any leave requests yet. When you do, they'll appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-5">
                {leaves.map((leave) => {
                  const badge = badgeConfig(leave.status);
                  const StatusIcon = badge.icon;

                  return (
                    <div
                      key={leave.id}
                      className="border border-gray-100 rounded-[1.5rem] p-5 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent to-transparent group-hover:from-brand-300 group-hover:to-teal-300 transition-colors"></div>

                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 pr-2">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">Reason</p>
                          <p className="font-bold text-gray-900 leading-tight">
                            {leave.reason}
                          </p>
                        </div>
                        <span
                          className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider font-bold border shadow-sm ${badge.color}`}
                        >
                          <StatusIcon size={12} strokeWidth={2.5} />
                          {leave.status}
                        </span>
                      </div>

                      <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                        <div className="flex justify-between items-center text-sm mb-2">
                          <span className="text-gray-500 font-medium">Duration</span>
                          <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                            {calculateDays(leave.fromDate, leave.toDate)} Day{calculateDays(leave.fromDate, leave.toDate) > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-gray-400 font-medium mb-0.5">From</span>
                            <span className="font-semibold text-gray-700">{formatDate(leave.fromDate)}</span>
                          </div>
                          <div className="w-4 border-t border-dashed border-gray-300"></div>
                          <div className="flex flex-col items-end">
                            <span className="text-gray-400 font-medium mb-0.5">To</span>
                            <span className="font-semibold text-gray-700">{formatDate(leave.toDate)}</span>
                          </div>
                        </div>
                      </div>

                      {leave.createdAt && (
                        <p className="text-[10px] text-gray-400 font-medium text-right mt-3">
                          Requested: {formatDate(leave.createdAt)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}