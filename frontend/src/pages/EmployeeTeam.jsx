import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/api";
import { Users, Mail, Phone, Briefcase, Building2, User, Search, MapPin } from "lucide-react";

export default function EmployeeTeam() {
  const workspaceId = localStorage.getItem("workspaceId");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (!workspaceId) {
          setLoading(false);
          return;
        }
        // ✅ Correct backend endpoint
        const res = await api.get(`/api/workspaces/${workspaceId}/members`);
        setMembers(res.data || []);
      } catch (err) {
        console.error("Failed to load members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [workspaceId]);

  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* PREMIUM HEADER */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-900 border border-brand-800/50 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-brand-400/30 transition-colors duration-700 mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10 shadow-inner">
              <Users className="text-indigo-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              Team Directory
            </h2>
            <p className="text-brand-100 mt-2 text-sm max-w-md">
              Connect and collaborate with your colleagues across the workspace.
            </p>
          </div>

          <div className="relative w-full md:w-72 mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-indigo-200" />
            </div>
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-200 rounded-[1.25rem] pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all backdrop-blur-md shadow-inner text-sm font-medium"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Users size={20} className="text-brand-500" /> All Team Members
        </h3>
        <span className="text-sm font-bold bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full border border-brand-100">
          {filteredMembers.length} {filteredMembers.length === 1 ? 'Member' : 'Members'}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-pulse h-64 flex flex-col">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="mt-auto space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 border border-brand-100 shadow-inner">
            <Users size={40} className="text-brand-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500 max-w-md">
            There don't seem to be any other employees in this workspace yet.
          </p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
            <Search size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any team members matching "{searchQuery}". Try adjusting your search.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-6 px-6 py-2.5 bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 font-bold rounded-xl transition-colors border border-brand-200"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((m) => {
            // Pick a deterministic gradient based on their name length or ID
            const gradients = [
              "from-blue-500 to-indigo-600",
              "from-brand-500 to-teal-500",
              "from-purple-500 to-pink-500",
              "from-orange-400 to-rose-500",
              "from-emerald-500 to-teal-600"
            ];

            const nameLen = m.name?.length || 0;
            const gradientClass = gradients[nameLen % gradients.length];
            const initial = m.name ? m.name.charAt(0).toUpperCase() : "U";

            return (
              <div
                key={m.id || m._id}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full"
              >
                {/* Card Header Background */}
                <div className={`h-24 bg-gradient-to-r ${gradientClass} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                </div>

                <div className="px-6 pb-6 pt-0 flex-1 flex flex-col relative">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-[1.25rem] bg-white p-1.5 shadow-md -mt-10 mx-auto relative z-10 border border-gray-100">
                    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-2xl font-black shadow-inner`}>
                      {initial}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center mt-3 mb-5">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-brand-600 transition-colors leading-tight">
                      {m.name || "Unknown User"}
                    </h3>
                    <p className="text-sm font-medium text-brand-500 mt-1 flex items-center justify-center gap-1.5">
                      <Briefcase size={14} />
                      {m.role || "Team Member"}
                    </p>
                  </div>

                  {/* Details Tags */}
                  <div className="mt-auto space-y-2.5 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-colors cursor-default">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <Building2 size={14} />
                      </div>
                      <span className="font-medium truncate" title={m.department || "No Department"}>
                        {m.department || "No Department"}
                      </span>
                    </div>

                    {m.email && (
                      <a href={`mailto:${m.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-colors group/link cursor-pointer">
                        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-teal-500 group-hover/link:bg-teal-500 group-hover/link:text-white transition-colors shrink-0">
                          <Mail size={14} />
                        </div>
                        <span className="font-medium truncate" title={m.email}>
                          {m.email}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
