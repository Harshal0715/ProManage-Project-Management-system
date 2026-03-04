import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import {
  CheckCircle2,
  Bell,
  RefreshCcw,
  MailOpen,
  Dot,
  BellRing,
  Clock,
} from "lucide-react";

export default function EmployeeNotifications() {
  const employeeId = localStorage.getItem("employeeId");
  const workspaceId = localStorage.getItem("workspaceId"); // ✅ FIX

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      if (!workspaceId || !employeeId) {
        setNotifications([]);
        return;
      }

      // ✅ FIXED API
      const res = await api.get(
        `/api/workspaces/${workspaceId}/notifications/employee/${employeeId}`
      );

      // Sort by newest first
      const sortedNotifs = (res.data || []).sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
      setNotifications(sortedNotifs);
    } catch (err) {
      console.log("Notification Error:", err.response?.data || err.message);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [workspaceId, employeeId]); // ✅ reload if workspace changes

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

      await api.put(
        `/api/workspaces/${workspaceId}/notifications/${id}/read`
      );
    } catch (err) {
      console.log(err);
      // Revert on error
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));

      const unread = notifications.filter((n) => !n.read);

      for (let n of unread) {
        await api.put(
          `/api/workspaces/${workspaceId}/notifications/${n.id}/read`
        );
      }
    } catch (err) {
      console.log(err);
      // Revert on error
      fetchNotifications();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    try {
      const date = new Date(dateString);
      const today = new Date();

      // If it's today, show time
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      }

      // Otherwise show date
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return "Just now";
    }
  };

  return (
    <Layout>
      {/* PREMIUM HEADER - Matched with Employee Dashboard style */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner relative">
              <Bell className="text-indigo-300 w-6 h-6" />
              {unreadCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-800"></div>
              )}
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Notifications
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md">
              Stay updated with tasks, leaves, and workspace announcements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 bg-white text-brand-900 px-5 py-2.5 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-md disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed border border-transparent"
            >
              <MailOpen size={18} /> Mark All Read
            </button>
            <button
              onClick={fetchNotifications}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md backdrop-blur-md"
              title="Refresh notifications"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BellRing size={20} className="text-brand-500" /> Recent Activity
        </h3>
        {unreadCount > 0 && (
          <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            {unreadCount} Unread
          </span>
        )}
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-6 lg:p-8 min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
            <p className="font-medium">Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-[1.5rem] bg-gray-50/50 p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 border border-gray-100 shadow-sm">
              <CheckCircle2 size={36} className="text-teal-400" />
            </div>
            <p className="text-gray-900 font-bold text-xl mb-2">
              You're all caught up!
            </p>
            <p className="text-sm text-gray-500 max-w-sm">
              When the admin assigns you tasks or updates your leave status, you'll be notified here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`relative p-5 rounded-[1.5rem] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 group ${n.read
                    ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
                    : "bg-brand-50/50 border-brand-200 shadow-sm hover:shadow-md"
                  }`}
              >
                {!n.read && (
                  <div className="absolute top-0 right-0 w-2 h-full bg-brand-500 rounded-r-[1.5rem]"></div>
                )}

                <div className="flex gap-4">
                  <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${n.read
                      ? 'bg-gray-50 border-gray-100 text-gray-400'
                      : 'bg-white border-brand-100 text-brand-500'
                    }`}>
                    {n.read ? <CheckCircle2 size={24} /> : <BellRing size={24} className="animate-[wiggle_1s_ease-in-out_infinite]" />}
                  </div>

                  <div>
                    <h4 className={`text-base leading-snug pr-4 ${n.read ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold'}`}>
                      {n.message}
                    </h4>

                    <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1.5">
                      <Clock size={12} />
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-end items-center sm:items-end gap-2 shrink-0 sm:pl-4 mt-2 sm:mt-0">
                  {!n.read ? (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="bg-white hover:bg-brand-50 text-brand-600 border border-brand-200 px-4 py-2 rounded-xl hover:border-brand-300 hover:text-brand-700 text-xs font-bold transition-all shadow-sm"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-100/80 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <CheckCircle2 size={12} strokeWidth={3} />
                      Read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}