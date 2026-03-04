import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { MessageSquare, Send, Users, User, Clock } from "lucide-react";

export default function Discussion() {
  const workspaceId = localStorage.getItem("workspaceId");
  const workspaceName = localStorage.getItem("workspaceName");
  const senderId = localStorage.getItem("userId") || localStorage.getItem("employeeId"); // Handle both admin and employee
  const senderRole = localStorage.getItem("role");
  const senderName = localStorage.getItem("name");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // ✅ Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Fetch messages
  const fetchMessages = async () => {
    try {
      if (!workspaceId) return;
      const res = await api.get(`/api/workspaces/${workspaceId}/discussions`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load discussion messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Optional: Set up polling for real-time updates if WebSockets aren't used
    const interval = setInterval(fetchMessages, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [workspaceId]);

  // ✅ Send new message
  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !workspaceId) return;

    const messageText = newMessage;
    setNewMessage(""); // Optimistic clear

    try {
      // Optimistic update
      const optMsg = {
        id: Date.now().toString(),
        senderId,
        senderRole,
        senderName,
        message: messageText,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, optMsg]);

      await api.post(`/api/workspaces/${workspaceId}/discussions`, {
        senderId,
        senderRole,
        senderName,
        message: messageText,
      });
      fetchMessages(); // Refresh to get true DB id
    } catch (err) {
      console.error("Failed to send message", err);
      // Could add rollback here on error
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp || Date.now()).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(msg);
    return acc;
  }, {});

  if (!workspaceId) {
    return (
      <Layout>
        <div className="bg-white border shadow-sm rounded-2xl p-12 text-center flex flex-col items-center justify-center h-[calc(100vh-12rem)] min-h-[500px]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
            <MessageSquare size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Workspace Selected</h3>
          <p className="text-gray-500 max-w-md">
            Please select or create a workspace to join the team discussion.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] flex flex-col h-[calc(100vh-8rem)] min-h-[600px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50/50 rounded-bl-full pointer-events-none -z-10"></div>

        {/* PREMIUM HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-500/20 pointer-events-none">
              <MessageSquare size={24} fill="currentColor" className="opacity-20 absolute" />
              <MessageSquare size={24} className="relative z-10" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Team Hub
              </h2>
              <p className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                <Users size={14} className="text-brand-500" />
                {workspaceName || "Workspace Chat"}
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-gray-50/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-brand-500 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
              <p className="font-medium text-gray-500">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6 border border-brand-100 shadow-inner">
                <MessageSquare size={48} className="text-brand-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Team Hub! 👋</h3>
              <p className="text-gray-500">
                This is the beginning of the workspace discussion. Say hello and start collaborating with your team!
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} className="space-y-6">
                <div className="flex justify-center my-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    {date}
                  </span>
                </div>

                {msgs.map((msg, index) => {
                  const isMe = msg.senderId === senderId;
                  const isAdmin = msg.senderRole === "ADMIN";

                  // Show avatar/name if it's the first message or if the sender changed from the previous message
                  const showHeader = index === 0 || msgs[index - 1].senderId !== msg.senderId;

                  return (
                    <div
                      key={msg.id || msg._id || index}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"} group`}
                    >
                      {showHeader && (
                        <div className={`flex items-center gap-2 mb-1.5 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${isAdmin ? "bg-indigo-600" : "bg-teal-500"
                            }`}>
                            {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : <User size={14} />}
                          </div>
                          <span className="text-sm font-bold text-gray-700">
                            {isMe ? "You" : (msg.senderName || msg.senderId)}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isAdmin ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-teal-50 text-teal-600 border border-teal-100"
                            }`}>
                            {msg.senderRole}
                          </span>
                        </div>
                      )}

                      <div className="flex items-end gap-2 max-w-[75%]">
                        {!isMe && (
                          <span className="text-[10px] font-medium text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(msg.timestamp)}
                          </span>
                        )}

                        <div
                          className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed relative ${isMe
                            ? "bg-gradient-to-br from-brand-500 to-indigo-600 text-white rounded-2xl rounded-tr-sm"
                            : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm hover:border-gray-200 transition-colors"
                            }`}
                        >
                          {msg.message}
                        </div>

                        {isMe && (
                          <span className="text-[10px] font-medium text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatTime(msg.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* INPUT AREA */}
        <div className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${workspaceName || 'team'}...`}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-[1.5rem] pl-6 pr-16 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 focus:bg-white transition-all resize-none shadow-sm min-h-[56px] max-h-[120px]"
              rows="1"
              style={{ overflow: 'hidden' }}
            // Auto-resize logic could be added here
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2.5 p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all disabled:opacity-50 disabled:bg-gray-400 shadow-md disabled:shadow-none flex items-center justify-center"
            >
              <Send size={18} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 text-center mt-3 font-medium flex items-center justify-center gap-1.5 uppercase tracking-wide">
            <Clock size={12} /> Messages are recorded in real-time
          </p>
        </div>
      </div>
    </Layout>
  );
}
