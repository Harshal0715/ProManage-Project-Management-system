import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { workspaceApi } from "../api/api";
import { Search, RefreshCcw, Trash2, Plus, Users, Mail, Briefcase, Building2, UserPlus } from "lucide-react";

export default function Employees() {
  const [workspaceId, setWorkspaceId] = useState(
    localStorage.getItem("workspaceId")
  );

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState(""); // ✅ new field
  const [department, setDepartment] = useState("");

  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  // 🔥 Listen for workspace change
  useEffect(() => {
    const handler = () =>
      setWorkspaceId(localStorage.getItem("workspaceId"));
    window.addEventListener("workspaceChanged", handler);
    return () => window.removeEventListener("workspaceChanged", handler);
  }, []);

  // ================= FETCH =================
  const fetchEmployees = async () => {
    try {
      if (!workspaceId) {
        setEmployees([]);
        return;
      }

      setLoading(true);
      const res = await workspaceApi.getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.log("Employee fetch failed:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [workspaceId]);

  // ================= CREATE =================
  const addEmployee = async (e) => {
    e.preventDefault();

    if (!name || !email || !designation || !department) {
      alert("Please fill all fields");
      return;
    }

    try {
      setCreating(true);

      await workspaceApi.createEmployee({
        name,
        email,
        role: "EMPLOYEE",       // ✅ fixed system role
        designation,            // ✅ job role from form
        department,
      });

      setName("");
      setEmail("");
      setDesignation("");
      setDepartment("");

      fetchEmployees();
    } catch (err) {
      console.log(err);
      alert("Failed to create employee");
    } finally {
      setCreating(false);
    }
  };

  // ================= DELETE =================
  const deleteEmployee = async (id) => {
    if (!confirm("Are you sure you want to remove this employee from the workspace?")) return;

    try {
      await workspaceApi.deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // ================= FILTER =================
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const s = search.toLowerCase();
      return (
        e.name?.toLowerCase().includes(s) ||
        e.email?.toLowerCase().includes(s) ||
        e.designation?.toLowerCase().includes(s) ||
        e.department?.toLowerCase().includes(s)
      );
    });
  }, [employees, search]);

  return (
    <Layout>

      {/* 🔥 Premium Header */}
      <div className="mb-8 p-8 rounded-[2rem] bg-gradient-to-r from-brand-900 via-brand-800 to-teal-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-screen"></div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center justify-center p-2.5 bg-white/10 rounded-xl mb-4 backdrop-blur-md border border-white/10">
              <Users className="text-brand-300 w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Team Directory</h2>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Manage your workspace members, assign roles, and build your dream team.
            </p>
          </div>

          <button
            onClick={fetchEmployees}
            className="w-fit bg-white/10 hover:bg-white text-white hover:text-brand-900 border border-white/20 whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh Directory
          </button>
        </div>
      </div>

      {/* ================= CREATE FORM ================= */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-10 opacity-50"></div>
        <div className="flex items-center gap-2 mb-6 text-gray-900">
          <UserPlus className="text-brand-500" />
          <h3 className="font-bold text-lg">Add New Team Member</h3>
        </div>

        <form
          onSubmit={addEmployee}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Full Name</label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-400"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-400"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Designation</label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-400"
              placeholder="e.g. Senior Developer"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">Department</label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-400"
              placeholder="e.g. Engineering"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4 mt-2">
            <button
              type="submit"
              disabled={creating}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 hover:-translate-y-0.5 shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all font-semibold outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <Plus size={18} />
              {creating ? "Adding Member..." : "Add to Team"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-8 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-md shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-300 transition-all">
        <Search size={18} className="text-gray-400" />
        <input
          className="outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Search team members by name, role, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= EMPLOYEE CARDS ================= */}
      {loading ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-gray-500">
          <RefreshCcw size={32} className="animate-spin mb-4 text-brand-500" />
          <p className="font-medium text-lg">Loading directory...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-500 max-w-sm">
            {search ? "Try adjusting your search terms." : "Start building your team by adding members above!"}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-brand-600 font-bold text-lg shadow-inner">
                    {emp.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors truncate w-full max-w-[150px]">{emp.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Mail size={12} className="text-gray-400" />
                      <span className="truncate w-full max-w-[150px]">{emp.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
                  title="Remove employee"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase size={16} className="text-brand-400" />
                  <span className="font-medium bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md text-xs">{emp.designation || "No Designation"}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 size={16} className="text-teal-400" />
                  <span className="font-medium bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-md text-xs">{emp.department || "No Department"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </Layout>
  );
}
